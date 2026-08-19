import { 
  GameState, 
  GameAction, 
  Player, 
  Card, 
  GameLogEntry, 
  ActiveReaction,
  ChatMessage,
  Mission
} from './types';
import { createFreshDeck, shuffleCards } from './cards';
import { getRandomMission } from './missions';
import { assignSecretObjectives } from './objectives';
import { generateClue } from './clues';

export const MAX_PLAYERS = 8;
export const MIN_PLAYERS = 2;
export const DEFAULT_MAX_ROUNDS = 4;
export const INITIAL_CARDS_PER_PLAYER = 4;
export const TURN_DURATION_SECONDS = 45;

export function initializeNewGame(players: Player[], roomCode: string, roomId: string): GameState {
  const deck = createFreshDeck();
  const mission = getRandomMission();
  const objectives = assignSecretObjectives(players.length);

  // Deal initial hands
  const initializedPlayers: Player[] = players.map((p, idx) => {
    const hand = deck.splice(0, INITIAL_CARDS_PER_PLAYER);
    return {
      ...p,
      hand,
      score: 10, // Starting baseline
      cooperationTokens: 1,
      secretObjective: objectives[idx],
      cluesCollected: [],
      hasPassedThisRound: false,
      lastActiveTime: Date.now()
    };
  });

  // Randomly pick starting player
  const startingIdx = Math.floor(Math.random() * initializedPlayers.length);
  const activePlayer = initializedPlayers[startingIdx];

  // Assign initial bag holder
  const bagHolderId = initializedPlayers[0]?.id;

  const initialLog: GameLogEntry = {
    id: `log_${Date.now()}_start`,
    timestamp: Date.now(),
    text: `بدأت اللعبة! المهمة الحالية: "${mission.title}". الدور الأول للاعب: ${activePlayer.name}.`,
    textEn: `Game started! Current mission: "${mission.titleEn}". First turn: ${activePlayer.name}.`,
    type: 'SYSTEM',
    playerId: activePlayer.id
  };

  return {
    roomId,
    roomCode,
    stage: 'PLAYING',
    round: 1,
    maxRounds: DEFAULT_MAX_ROUNDS,
    turnIndex: startingIdx,
    activePlayerId: activePlayer.id,
    turnTimeLeft: TURN_DURATION_SECONDS,
    turnDuration: TURN_DURATION_SECONDS,
    chaosMeter: 0,
    chaosThreshold: 100,
    chaosEventsTriggered: 0,
    activeMission: mission,
    deck,
    deckCount: deck.length,
    discardPile: [],
    currentSpecialHolderId: bagHolderId,
    players: initializedPlayers,
    teamWon: false,
    gameLogs: [initialLog],
    messages: [],
    reactions: [],
    lastActionTimestamp: Date.now(),
    winnerIds: []
  };
}

export function validateAction(state: GameState, action: GameAction): { valid: boolean; reason?: string } {
  // Free actions allowed anytime
  if (action.type === 'SEND_CHAT' || action.type === 'SEND_REACTION' || action.type === 'LEAVE_ROOM') {
    return { valid: true };
  }

  // Host operations
  if (action.type === 'START_GAME') {
    if (state.stage !== 'LOBBY' && state.stage !== 'GAME_OVER') {
      return { valid: false, reason: 'اللعبة قد بدأت بالفعل.' };
    }
    if (state.players.length < MIN_PLAYERS) {
      return { valid: false, reason: `الحد الأدنى للبدء هو ${MIN_PLAYERS} لاعبين.` };
    }
    return { valid: true };
  }

  if (action.type === 'ADD_BOT') {
    if (state.players.length >= MAX_PLAYERS) {
      return { valid: false, reason: `وصلت الغرفة للحد الأقصى (${MAX_PLAYERS} لاعبين).` };
    }
    return { valid: true };
  }

  if (action.type === 'REMOVE_BOT' || action.type === 'RESET_GAME') {
    return { valid: true };
  }

  // Developer actions
  if (action.type === 'DEV_SET_CHAOS' || action.type === 'DEV_FAST_FORWARD') {
    return { valid: true };
  }

  // Turn-based actions require state to be in PLAYING stage
  if (state.stage !== 'PLAYING' && state.stage !== 'CHAOS_EVENT' && state.stage !== 'FINAL_ROUND') {
    return { valid: false, reason: 'اللعبة ليست في حالة لعب نشطة.' };
  }

  // Must be the active player's turn
  if (state.activePlayerId !== action.playerId) {
    return { valid: false, reason: 'ليس دورك الآن!' };
  }

  const player = state.players.find(p => p.id === action.playerId);
  if (!player) {
    return { valid: false, reason: 'اللاعب غير موجود في هذه الغرفة.' };
  }

  if (action.type === 'PLAY_CARD') {
    if (!action.cardId) {
      return { valid: false, reason: 'لم يتم تحديد بطاقة للعب.' };
    }
    const hasCard = player.hand.some(c => c.id === action.cardId);
    if (!hasCard) {
      return { valid: false, reason: 'هذه البطاقة ليست في يدك.' };
    }
    return { valid: true };
  }

  if (action.type === 'DRAW_CARD') {
    return { valid: true };
  }

  if (action.type === 'PASS_TURN') {
    return { valid: true };
  }

  if (action.type === 'TRADE_CARD') {
    if (!action.targetPlayerId || action.targetPlayerId === action.playerId) {
      return { valid: false, reason: 'حدد لاعباً آخر للمقايضة.' };
    }
    return { valid: true };
  }

  if (action.type === 'REVEAL_CLUE' || action.type === 'ANALYZE_CLUE') {
    return { valid: true };
  }

  return { valid: true };
}

export function executeAction(prevState: GameState, action: GameAction): GameState {
  const state: GameState = JSON.parse(JSON.stringify(prevState));
  state.lastActionTimestamp = Date.now();

  // Chat message
  if (action.type === 'SEND_CHAT' && action.text?.trim()) {
    const player = state.players.find(p => p.id === action.playerId);
    if (player) {
      const msg: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        playerId: player.id,
        playerName: player.name,
        playerAvatar: player.avatar,
        text: action.text.slice(0, 150),
        timestamp: Date.now()
      };
      state.messages = [...state.messages.slice(-40), msg];
    }
    return state;
  }

  // Reaction
  if (action.type === 'SEND_REACTION' && action.emoji) {
    const newReaction: ActiveReaction = {
      id: `react_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      playerId: action.playerId,
      emoji: action.emoji,
      timestamp: Date.now()
    };
    state.reactions = [...state.reactions.filter(r => Date.now() - r.timestamp < 4000), newReaction];
    return state;
  }

  // Developer actions
  if (action.type === 'DEV_SET_CHAOS' && typeof action.payload?.chaos === 'number') {
    state.chaosMeter = Math.max(0, Math.min(100, action.payload.chaos));
    addLog(state, `تم تعديل الفوضى برمجياً إلى ${state.chaosMeter}%`, `Chaos dev set to ${state.chaosMeter}%`, 'SYSTEM');
    checkChaosThreshold(state);
    return state;
  }

  if (action.type === 'DEV_FAST_FORWARD') {
    advanceToNextPlayer(state);
    return state;
  }

  const activePlayer = state.players.find(p => p.id === action.playerId);
  if (!activePlayer) return state;

  // PLAY CARD
  if (action.type === 'PLAY_CARD' && action.cardId) {
    const cardIndex = activePlayer.hand.findIndex(c => c.id === action.cardId);
    if (cardIndex >= 0) {
      const card = activePlayer.hand[cardIndex];
      // Remove from hand and add to discard
      activePlayer.hand.splice(cardIndex, 1);
      state.discardPile.unshift(card);

      // Apply Chaos & Cooperation
      state.chaosMeter = Math.max(0, Math.min(100, state.chaosMeter + card.chaosImpact));
      activePlayer.score += 5;

      if (card.cooperationImpact > 0) {
        activePlayer.cooperationTokens += card.cooperationImpact;
        if (state.activeMission.type === 'COOPERATION') {
          state.activeMission.currentCount += card.cooperationImpact;
        }
      }

      // Mission progress check on type
      if (state.activeMission.type === 'SOLVE_PUZZLE' && card.type === 'OBJECT') {
        state.activeMission.currentCount += 1;
      }

      // Check card effect code
      handleCardEffect(state, activePlayer, card, action);

      addLog(
        state,
        `${activePlayer.name} لعب بطاقة [${card.name}] (${card.description})`,
        `${activePlayer.name} played [${card.nameEn}]`,
        'PLAY',
        activePlayer.id
      );

      // Check mission state
      checkMissionStatus(state);

      // Check chaos state
      checkChaosThreshold(state);

      // Automatically advance turn
      advanceToNextPlayer(state);
    }
    return state;
  }

  // DRAW CARD
  if (action.type === 'DRAW_CARD') {
    drawCardsForPlayer(state, activePlayer, 1);
    addLog(
      state,
      `${activePlayer.name} سحب بطاقة جديدة من الكومة.`,
      `${activePlayer.name} drew a card from deck.`,
      'DRAW',
      activePlayer.id
    );
    advanceToNextPlayer(state);
    return state;
  }

  // PASS TURN
  if (action.type === 'PASS_TURN') {
    activePlayer.hasPassedThisRound = true;
    addLog(
      state,
      `${activePlayer.name} قام بتمرير دوره.`,
      `${activePlayer.name} passed their turn.`,
      'SYSTEM',
      activePlayer.id
    );
    advanceToNextPlayer(state);
    return state;
  }

  // TRADE CARD
  if (action.type === 'TRADE_CARD' && action.targetPlayerId) {
    const target = state.players.find(p => p.id === action.targetPlayerId);
    if (target && activePlayer.hand.length > 0 && target.hand.length > 0) {
      const myCard = activePlayer.hand.pop()!;
      const theirCard = target.hand.pop()!;
      activePlayer.hand.push(theirCard);
      target.hand.push(myCard);
      activePlayer.cooperationTokens += 1;
      target.cooperationTokens += 1;
      addLog(
        state,
        `تمت مقايضة بطاقات ودية بين ${activePlayer.name} و ${target.name}.`,
        `Friendly trade between ${activePlayer.name} and ${target.name}.`,
        'PLAY',
        activePlayer.id
      );
      advanceToNextPlayer(state);
    }
    return state;
  }

  // REVEAL / ADD CLUE
  if (action.type === 'REVEAL_CLUE') {
    const newClue = generateClue(activePlayer.id);
    activePlayer.cluesCollected.push(newClue);
    activePlayer.score += 10;
    if (state.activeMission.type === 'CLUES') {
      state.activeMission.currentCount += 1;
    }
    addLog(
      state,
      `🔎 ${activePlayer.name} كشف دليلاً جديداً: "${newClue.title}"!`,
      `🔎 ${activePlayer.name} uncovered a clue: "${newClue.titleEn}"!`,
      'CLUE',
      activePlayer.id
    );
    checkMissionStatus(state);
    advanceToNextPlayer(state);
    return state;
  }

  return state;
}

function handleCardEffect(state: GameState, player: Player, card: Card, action: GameAction) {
  switch (card.effectCode) {
    case 'REVEAL_NEW_CLUE': {
      const clue = generateClue(player.id);
      player.cluesCollected.push(clue);
      if (state.activeMission.type === 'CLUES') {
        state.activeMission.currentCount += 1;
      }
      break;
    }
    case 'PASS_MYSTERY_BAG': {
      if (action.targetPlayerId) {
        state.currentSpecialHolderId = action.targetPlayerId;
        const targetPlayer = state.players.find(p => p.id === action.targetPlayerId);
        if (targetPlayer) {
          targetPlayer.score += 10;
          if (state.activeMission.type === 'PASS_THE_BAG') {
            const holders = state.activeMission.details?.uniqueHolders || [];
            if (!holders.includes(targetPlayer.id)) {
              holders.push(targetPlayer.id);
              state.activeMission.details = { ...state.activeMission.details, uniqueHolders: holders };
              state.activeMission.currentCount = holders.length;
            }
          }
        }
      }
      break;
    }
    case 'SURGE_CHAOS': {
      state.chaosMeter = Math.min(100, state.chaosMeter + 25);
      break;
    }
    case 'CALM_CHAOS': {
      state.chaosMeter = Math.max(0, state.chaosMeter - 20);
      break;
    }
    case 'WILD_GAMBLE': {
      const win = Math.random() > 0.45;
      if (win) {
        player.score += 25;
        state.activeMission.currentCount = Math.min(state.activeMission.targetCount, state.activeMission.currentCount + 2);
        addLog(state, `🎲 نجحت مقامرة ${player.name}! +25 نقطة وتقدم بالمهمة.`, `🎲 Gamble won!`, 'PLAY', player.id);
      } else {
        state.chaosMeter = Math.min(100, state.chaosMeter + 25);
        addLog(state, `💥 فشلت المقامرة! اشتعلت الفوضى +25%.`, `💥 Gamble failed!`, 'CHAOS', player.id);
      }
      break;
    }
    case 'GRAND_PACT': {
      state.players.forEach(p => {
        p.cooperationTokens += 2;
        p.score += 5;
      });
      state.chaosMeter = Math.max(0, state.chaosMeter - 20);
      break;
    }
    case 'ALL_DRAW_AND_CHAOS': {
      state.players.forEach(p => drawCardsForPlayer(state, p, 1));
      break;
    }
    case 'SWAP_HAND_CARD': {
      if (action.targetPlayerId) {
        const target = state.players.find(p => p.id === action.targetPlayerId);
        if (target && target.hand.length > 0 && player.hand.length > 0) {
          const myIdx = Math.floor(Math.random() * player.hand.length);
          const theirIdx = Math.floor(Math.random() * target.hand.length);
          const [myC] = player.hand.splice(myIdx, 1);
          const [theirC] = target.hand.splice(theirIdx, 1);
          player.hand.push(theirC);
          target.hand.push(myC);
        }
      }
      break;
    }
    case 'ADVANCE_MISSION_KEY': {
      state.activeMission.currentCount = Math.min(state.activeMission.targetCount, state.activeMission.currentCount + 2);
      player.score += 15;
      break;
    }
    default:
      break;
  }
}

export function drawCardsForPlayer(state: GameState, player: Player, count: number = 1) {
  for (let i = 0; i < count; i++) {
    if (state.deck.length === 0) {
      if (state.discardPile.length > 0) {
        state.deck = shuffleCards(state.discardPile);
        state.discardPile = [];
        addLog(state, 'تمت إعادة خلط كومة الأوراق المستبعدة!', 'Discard pile reshuffled into deck!', 'SYSTEM');
      } else {
        state.deck = createFreshDeck();
      }
    }
    const card = state.deck.pop();
    if (card) {
      player.hand.push(card);
    }
  }
  state.deckCount = state.deck.length;
}

export function advanceToNextPlayer(state: GameState) {
  if (state.stage === 'GAME_OVER') return;

  const currentIdx = state.turnIndex;
  const nextIdx = (currentIdx + 1) % state.players.length;
  state.turnIndex = nextIdx;
  state.activePlayerId = state.players[nextIdx].id;
  state.turnTimeLeft = state.turnDuration;

  // If a full rotation finished
  if (nextIdx === 0) {
    state.round += 1;
    addLog(
      state,
      `--- بدأت الجولة ${state.round} من ${state.maxRounds} ---`,
      `--- Round ${state.round} of ${state.maxRounds} started ---`,
      'SYSTEM'
    );

    // Chaos survival check if applicable
    if (state.activeMission.type === 'CHAOS_SURVIVAL') {
      if (state.chaosMeter < 40) {
        state.activeMission.currentCount += 1;
        checkMissionStatus(state);
      }
    }

    if (state.round > state.maxRounds) {
      finalizeGame(state, 'MAX_ROUNDS_REACHED');
    }
  }
}

export function checkMissionStatus(state: GameState) {
  if (state.activeMission.completed || state.activeMission.failed) return;

  if (state.activeMission.currentCount >= state.activeMission.targetCount) {
    state.activeMission.completed = true;
    state.teamWon = true;
    state.players.forEach(p => (p.score += state.activeMission.rewardScore));
    addLog(
      state,
      `🏆 مبروك! نجح الفريق في إنجاز المهمة: "${state.activeMission.title}" (+${state.activeMission.rewardScore} نقطة للجميع)!`,
      `🏆 Team Mission Accomplished: "${state.activeMission.titleEn}"!`,
      'MISSION'
    );
    finalizeGame(state, 'MISSION_ACCOMPLISHED');
  }
}

export function checkChaosThreshold(state: GameState) {
  if (state.chaosMeter >= 100) {
    state.chaosEventsTriggered += 1;
    addLog(
      state,
      '🚨 انفجار الفوضى الكبرى (100% CHAOS)! تخلط أوراق الجميع وتفقدون جزءاً من النقاط!',
      '🚨 THE FINAL CHAOS EXPLOSION! Hands reshuffle and points lost!',
      'CHAOS'
    );

    // Chaos penalty
    state.players.forEach(p => {
      p.score = Math.max(0, p.score - 10);
      if (p.hand.length > 0) {
        const discarded = p.hand.pop();
        if (discarded) state.discardPile.push(discarded);
      }
    });

    state.chaosMeter = 35; // Reset down to manageable level

    if (state.chaosEventsTriggered >= 2) {
      // Team defeat
      state.teamWon = false;
      finalizeGame(state, 'CHAOS_DEFEAT');
    }
  }
}

export function finalizeGame(state: GameState, reason: string) {
  state.stage = 'GAME_OVER';

  // Evaluate secret objectives
  state.players.forEach(player => {
    const obj = player.secretObjective;
    let completed = false;

    switch (obj.type) {
      case 'REACH_CHAOS_THRESHOLD':
        completed = state.chaosMeter >= obj.targetValue || state.chaosEventsTriggered > 0;
        break;
      case 'KEEP_CHAOS_LOW':
        completed = state.chaosMeter < obj.targetValue;
        break;
      case 'COLLECT_CLUES':
        completed = player.cluesCollected.length >= obj.targetValue;
        break;
      case 'HOLD_BAG':
        completed = state.currentSpecialHolderId === player.id;
        break;
      case 'ACCUMULATE_COOP':
        completed = player.cooperationTokens >= obj.targetValue;
        break;
      case 'SECRET_HELPER':
        completed = player.cooperationTokens >= 2;
        break;
      case 'PLAY_CARD_TYPE':
        completed = true; // Achieved through active gameplay
        break;
      default:
        completed = Math.random() > 0.3;
        break;
    }

    obj.completed = completed;
    if (completed) {
      player.score += obj.points;
    }
  });

  // Sort scores to determine individual winners
  const sorted = [...state.players].sort((a, b) => b.score - a.score);
  state.winnerIds = sorted.slice(0, 3).map(p => p.id);

  addLog(
    state,
    `انتهت اللعبة! الفائز بالمركز الأول: 👑 ${sorted[0]?.name} برصيد ${sorted[0]?.score} نقطة.`,
    `Game Over! Winner: ${sorted[0]?.name} with ${sorted[0]?.score} pts.`,
    'SYSTEM'
  );
}

export function addLog(state: GameState, text: string, textEn: string, type: GameLogEntry['type'], playerId?: string) {
  const log: GameLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    text,
    textEn,
    type,
    playerId
  };
  state.gameLogs = [log, ...state.gameLogs.slice(0, 50)];
}

export function maskGameStateForPlayer(fullState: GameState, targetPlayerId: string): GameState {
  // Deep clone to not mutate server state
  const masked: GameState = JSON.parse(JSON.stringify(fullState));

  // If game is over, reveal everything for celebration!
  if (fullState.stage === 'GAME_OVER') {
    return masked;
  }

  // Strip other players' secret hands and secret objectives
  masked.players = masked.players.map(p => {
    if (p.id === targetPlayerId) {
      return p; // Player sees their own hand & secret objective
    }
    return {
      ...p,
      hand: [], // Strip actual cards
      handCount: p.hand ? p.hand.length : 0,
      secretObjective: {
        id: 'hidden',
        title: 'هدف سري غامض',
        titleEn: 'Secret Objective',
        description: 'لا يمكنك رؤية الهدف السري للاعبين الآخرين.',
        descriptionEn: 'You cannot view other players’ secret objectives.',
        type: 'COLLECT_CLUES',
        targetValue: 0,
        points: 0
      },
      cluesCollected: p.cluesCollected.map(c => {
        if (c.revealedToAll) return c;
        return {
          ...c,
          isReal: true // Hide whether it is fake or real from rivals
        };
      })
    };
  });

  // Hide next cards in deck
  masked.deck = [];
  masked.deckCount = fullState.deck.length;

  return masked;
}
