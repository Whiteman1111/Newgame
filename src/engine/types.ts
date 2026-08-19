export type CardType = 
  | 'CHARACTER'
  | 'OBJECT'
  | 'EVENT'
  | 'ACTION'
  | 'SECRET'
  | 'CHAOS'
  | 'COOPERATION'
  | 'CLUE';

export type CardRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY';

export interface Card {
  id: string;
  name: string;
  nameEn: string;
  type: CardType;
  rarity: CardRarity;
  description: string;
  descriptionEn: string;
  icon: string; // Lucide icon identifier or emoji
  chaosImpact: number; // e.g. +10, -5, +20
  cooperationImpact: number; // e.g. +1, +2
  clueValue?: boolean; // For CLUE cards: true or false clue
  clueHint?: string; // Hint provided by clue
  targetRequired: boolean; // Needs target player
  targetType?: 'PLAYER' | 'CARD' | 'SELF' | 'ALL' | 'ANY';
  effectCode: string; // Action handler code
}

export type PlayerRole = 'HOST' | 'PLAYER' | 'BOT';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  role: PlayerRole;
  isBot: boolean;
  botDifficulty?: 'EASY' | 'NORMAL' | 'SMART';
  isConnected: boolean;
  hand: Card[]; // Server has full cards; for client-side masking, other players' hands are stripped to count
  handCount?: number;
  secretObjective: SecretObjective;
  score: number;
  cluesCollected: Clue[];
  cooperationTokens: number;
  hasPassedThisRound?: boolean;
  lastActiveTime: number;
}

export interface Clue {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  isReal: boolean; // True or False clue (hidden from player unless revealed/analyzed)
  discoveredBy: string; // Player ID
  revealedToAll: boolean;
  category: 'SUSPECT' | 'LOCATION' | 'OBJECT' | 'TIMELINE';
}

export interface Mission {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  targetCount: number;
  currentCount: number;
  type: 'CLUES' | 'COOPERATION' | 'CHAOS_SURVIVAL' | 'PASS_THE_BAG' | 'PROTECT_CHARACTER' | 'SOLVE_PUZZLE';
  completed: boolean;
  failed: boolean;
  rewardScore: number;
  penaltyChaos: number;
  icon: string;
  details?: Record<string, any>;
}

export interface SecretObjective {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: 
    | 'COLLECT_CLUES'
    | 'HOLD_BAG'
    | 'PASS_BAG_TO_TARGET'
    | 'REACH_CHAOS_THRESHOLD'
    | 'KEEP_CHAOS_LOW'
    | 'PLAY_CARD_TYPE'
    | 'ACCUMULATE_COOP'
    | 'FINISH_WITH_CARD'
    | 'TRIGGER_CHAOS_EVENT'
    | 'SECRET_HELPER';
  targetValue: number;
  targetPlayerId?: string;
  targetCardType?: CardType;
  targetCardId?: string;
  points: number;
  completed?: boolean;
}

export type GameStage = 
  | 'LOBBY'
  | 'STARTING'
  | 'PLAYING'
  | 'CHAOS_EVENT'
  | 'ROUND_TRANSITION'
  | 'FINAL_ROUND'
  | 'GAME_OVER';

export interface GameLogEntry {
  id: string;
  timestamp: number;
  text: string;
  textEn: string;
  type: 'PLAY' | 'DRAW' | 'CHAOS' | 'MISSION' | 'CLUE' | 'SYSTEM' | 'REACTION';
  playerId?: string;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  text: string;
  timestamp: number;
}

export interface ActiveReaction {
  id: string;
  playerId: string;
  emoji: string;
  timestamp: number;
}

export interface GameState {
  roomId: string;
  roomCode: string;
  stage: GameStage;
  round: number;
  maxRounds: number;
  turnIndex: number;
  activePlayerId: string;
  turnTimeLeft: number;
  turnDuration: number;
  chaosMeter: number; // 0 to 100
  chaosThreshold: number; // 100
  chaosEventsTriggered: number;
  activeMission: Mission;
  deck: Card[];
  deckCount: number;
  discardPile: Card[];
  currentSpecialHolderId?: string; // e.g. "The Mystery Bag" holder or special character
  players: Player[];
  teamWon: boolean;
  gameLogs: GameLogEntry[];
  messages: ChatMessage[];
  reactions: ActiveReaction[];
  lastActionTimestamp: number;
  winnerIds: string[];
}

export type ActionType = 
  | 'START_GAME'
  | 'DRAW_CARD'
  | 'PLAY_CARD'
  | 'PASS_TURN'
  | 'TRADE_CARD'
  | 'REVEAL_CLUE'
  | 'ANALYZE_CLUE'
  | 'ADD_BOT'
  | 'REMOVE_BOT'
  | 'SEND_CHAT'
  | 'SEND_REACTION'
  | 'RESET_GAME'
  | 'DEV_SET_CHAOS'
  | 'DEV_FAST_FORWARD'
  | 'LEAVE_ROOM';

export interface GameAction {
  type: ActionType;
  playerId: string;
  cardId?: string;
  targetPlayerId?: string;
  targetCardId?: string;
  clueId?: string;
  text?: string;
  emoji?: string;
  botDifficulty?: 'EASY' | 'NORMAL' | 'SMART';
  payload?: any;
}
