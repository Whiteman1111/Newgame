import { 
  GameState, 
  GameAction, 
  Player, 
  PlayerRole 
} from './types';
import { 
  initializeNewGame, 
  validateAction, 
  executeAction, 
  maskGameStateForPlayer, 
  MIN_PLAYERS,
  MAX_PLAYERS
} from './rules';
import { generateBotPlayer, computeBotAction } from './aiBot';
import { getRandomMission } from './missions';

export type SSEClient = {
  playerId: string;
  res: any; // Express Response or Event Stream handler
};

export class GameRoom {
  public state: GameState;
  public subscribers: Map<string, (state: GameState) => void> = new Map();
  private botTimer: any = null;

  constructor(public roomCode: string, public roomId: string, hostPlayer: Player) {
    this.state = {
      roomId,
      roomCode,
      stage: 'LOBBY',
      round: 1,
      maxRounds: 4,
      turnIndex: 0,
      activePlayerId: hostPlayer.id,
      turnTimeLeft: 45,
      turnDuration: 45,
      chaosMeter: 0,
      chaosThreshold: 100,
      chaosEventsTriggered: 0,
      activeMission: getRandomMission(),
      deck: [],
      deckCount: 0,
      discardPile: [],
      players: [hostPlayer],
      teamWon: false,
      gameLogs: [
        {
          id: `log_init_${Date.now()}`,
          timestamp: Date.now(),
          text: `تم إنشاء الغرفة ${roomCode}. بانتظار انضمام اللاعبين...`,
          textEn: `Room ${roomCode} created. Waiting for players...`,
          type: 'SYSTEM'
        }
      ],
      messages: [],
      reactions: [],
      lastActionTimestamp: Date.now(),
      winnerIds: []
    };
  }

  public subscribe(playerId: string, callback: (maskedState: GameState) => void) {
    this.subscribers.set(playerId, callback);
    // Send immediate snapshot
    callback(maskGameStateForPlayer(this.state, playerId));

    // Update connection status
    const player = this.state.players.find(p => p.id === playerId);
    if (player) {
      player.isConnected = true;
      player.lastActiveTime = Date.now();
    }
  }

  public unsubscribe(playerId: string) {
    this.subscribers.delete(playerId);
    const player = this.state.players.find(p => p.id === playerId);
    if (player) {
      player.isConnected = false;
    }
    this.broadcast();
  }

  public broadcast() {
    for (const [playerId, callback] of this.subscribers.entries()) {
      try {
        const masked = maskGameStateForPlayer(this.state, playerId);
        callback(masked);
      } catch (err) {
        console.error(`Failed to broadcast to player ${playerId}:`, err);
      }
    }
  }

  public joinPlayer(name: string, avatar: string): Player {
    if (this.state.players.length >= MAX_PLAYERS) {
      throw new Error(`الغرفة ممتلئة (الحد الأقصى ${MAX_PLAYERS} لاعبين).`);
    }
    if (this.state.stage !== 'LOBBY') {
      throw new Error('لا يمكن الانضمام أثناء سير اللعبة.');
    }

    const newPlayer: Player = {
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim() || `لاعب ${this.state.players.length + 1}`,
      avatar: avatar || '🕵️',
      role: 'PLAYER',
      isBot: false,
      isConnected: true,
      hand: [],
      score: 0,
      cluesCollected: [],
      cooperationTokens: 1,
      lastActiveTime: Date.now(),
      secretObjective: {
        id: 'init_obj',
        title: 'بانتظار البدء',
        titleEn: 'Waiting to Start',
        description: 'سيتم تحديد هدفك السري عند انطلاق اللعبة.',
        descriptionEn: 'Your secret objective will be assigned upon launch.',
        type: 'SECRET_HELPER',
        targetValue: 1,
        points: 0
      }
    };

    this.state.players.push(newPlayer);
    this.state.gameLogs.unshift({
      id: `log_join_${Date.now()}`,
      timestamp: Date.now(),
      text: `انضم ${newPlayer.name} إلى الغرفة.`,
      textEn: `${newPlayer.name} joined the room.`,
      type: 'SYSTEM'
    });

    this.broadcast();
    return newPlayer;
  }

  public addBot(difficulty: 'EASY' | 'NORMAL' | 'SMART' = 'NORMAL'): Player {
    if (this.state.players.length >= MAX_PLAYERS) {
      throw new Error(`الحد الأقصى ${MAX_PLAYERS} لاعبين.`);
    }
    const bot = generateBotPlayer(this.state.players.length, difficulty);
    this.state.players.push(bot);
    this.state.gameLogs.unshift({
      id: `log_bot_${Date.now()}`,
      timestamp: Date.now(),
      text: `تمت إضافة ${bot.name} إلى الغرفة.`,
      textEn: `${bot.name} joined the room.`,
      type: 'SYSTEM'
    });
    this.broadcast();
    return bot;
  }

  public removePlayer(playerId: string) {
    const idx = this.state.players.findIndex(p => p.id === playerId);
    if (idx >= 0) {
      const removed = this.state.players.splice(idx, 1)[0];
      this.state.gameLogs.unshift({
        id: `log_leave_${Date.now()}`,
        timestamp: Date.now(),
        text: `غادر ${removed.name} الغرفة.`,
        textEn: `${removed.name} left the room.`,
        type: 'SYSTEM'
      });
      // If host left, reassign host
      if (removed.role === 'HOST' && this.state.players.length > 0) {
        const nextHuman = this.state.players.find(p => !p.isBot) || this.state.players[0];
        nextHuman.role = 'HOST';
      }
      this.broadcast();
    }
  }

  public dispatchAction(action: GameAction): { success: boolean; error?: string } {
    if (action.type === 'START_GAME') {
      const validation = validateAction(this.state, action);
      if (!validation.valid) {
        return { success: false, error: validation.reason };
      }
      this.state = initializeNewGame(this.state.players, this.state.roomCode, this.state.roomId);
      this.broadcast();
      this.scheduleBotTurnIfNeeded();
      return { success: true };
    }

    if (action.type === 'ADD_BOT') {
      try {
        this.addBot(action.botDifficulty || 'NORMAL');
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    if (action.type === 'REMOVE_BOT' && action.targetPlayerId) {
      this.removePlayer(action.targetPlayerId);
      return { success: true };
    }

    if (action.type === 'RESET_GAME') {
      this.state.stage = 'LOBBY';
      this.state.round = 1;
      this.state.chaosMeter = 0;
      this.state.teamWon = false;
      this.state.winnerIds = [];
      this.state.players.forEach(p => {
        p.hand = [];
        p.score = 0;
        p.cluesCollected = [];
      });
      this.broadcast();
      return { success: true };
    }

    const validation = validateAction(this.state, action);
    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }

    this.state = executeAction(this.state, action);
    this.broadcast();
    this.scheduleBotTurnIfNeeded();
    return { success: true };
  }

  private scheduleBotTurnIfNeeded() {
    if (this.botTimer) {
      clearTimeout(this.botTimer);
      this.botTimer = null;
    }

    if (this.state.stage !== 'PLAYING') return;

    const activePlayer = this.state.players.find(p => p.id === this.state.activePlayerId);
    if (activePlayer && activePlayer.isBot) {
      // Natural human-like thinking delay between 1.0s and 2.0s
      const delay = 1200 + Math.random() * 800;
      this.botTimer = setTimeout(() => {
        if (this.state.stage === 'PLAYING' && this.state.activePlayerId === activePlayer.id) {
          const botAction = computeBotAction(this.state, activePlayer);
          this.dispatchAction(botAction);
        }
      }, delay);
    }
  }
}

class RoomManager {
  private rooms: Map<string, GameRoom> = new Map();

  public createRoom(hostName: string, hostAvatar: string): { room: GameRoom; host: Player } {
    const roomCode = this.generateRoomCode();
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const hostPlayer: Player = {
      id: `p_host_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: hostName.trim() || 'المضيف (Host)',
      avatar: hostAvatar || '👑',
      role: 'HOST',
      isBot: false,
      isConnected: true,
      hand: [],
      score: 0,
      cluesCollected: [],
      cooperationTokens: 1,
      lastActiveTime: Date.now(),
      secretObjective: {
        id: 'init_obj_host',
        title: 'بانتظار البدء',
        titleEn: 'Waiting to Start',
        description: 'سيتم تحديد هدفك السري عند انطلاق اللعبة.',
        descriptionEn: 'Your secret objective will be assigned upon launch.',
        type: 'SECRET_HELPER',
        targetValue: 1,
        points: 0
      }
    };

    const room = new GameRoom(roomCode, roomId, hostPlayer);
    this.rooms.set(roomCode, room);
    return { room, host: hostPlayer };
  }

  public getRoom(roomCode: string): GameRoom | undefined {
    return this.rooms.get(roomCode.toUpperCase().trim());
  }

  public getAllRooms(): GameRoom[] {
    return Array.from(this.rooms.values());
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure uniqueness
    if (this.rooms.has(code)) {
      return this.generateRoomCode();
    }
    return code;
  }
}

export const roomManager = new RoomManager();
