import { GameState, Player, GameAction } from './types';

export const BOT_NAMES = [
  'روبوت مروان',
  'الآلي طارق',
  'فارس الذكي',
  'نورة الذكية',
  'العميل 007',
  'سلطان الماكر',
  'سارة المحققة'
];

export const BOT_AVATARS = ['🤖', '🕵️', '🎩', '🦊', '⚡', '🦉', '🔮'];

export function generateBotPlayer(index: number, difficulty: 'EASY' | 'NORMAL' | 'SMART' = 'NORMAL'): Player {
  const name = BOT_NAMES[index % BOT_NAMES.length];
  const avatar = BOT_AVATARS[index % BOT_AVATARS.length];
  return {
    id: `bot_${Date.now()}_${index}`,
    name: `${name} (Bot)`,
    avatar,
    role: 'BOT',
    isBot: true,
    botDifficulty: difficulty,
    isConnected: true,
    hand: [],
    score: 0,
    cluesCollected: [],
    cooperationTokens: 1,
    lastActiveTime: Date.now(),
    secretObjective: {
      id: 'bot_obj',
      title: 'مساعدة الفريق',
      titleEn: 'Help the Team',
      description: 'يقوم البوت بمساعدة الفريق تلقائياً.',
      descriptionEn: 'Bot attempts to assist the squad.',
      type: 'SECRET_HELPER',
      targetValue: 2,
      points: 20
    }
  };
}

export function computeBotAction(state: GameState, bot: Player): GameAction {
  // If no cards in hand, draw a card
  if (bot.hand.length === 0) {
    return {
      type: 'DRAW_CARD',
      playerId: bot.id
    };
  }

  // Pick other players for targeting if needed
  const otherPlayers = state.players.filter(p => p.id !== bot.id);
  const randomTarget = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];

  // Smart bot evaluation
  if (bot.botDifficulty === 'SMART' || bot.botDifficulty === 'NORMAL') {
    // If Chaos is high (> 60%), prioritize calming/coop cards
    if (state.chaosMeter > 60) {
      const calmCard = bot.hand.find(c => c.chaosImpact < 0 || c.type === 'COOPERATION');
      if (calmCard) {
        return {
          type: 'PLAY_CARD',
          playerId: bot.id,
          cardId: calmCard.id,
          targetPlayerId: calmCard.targetRequired ? randomTarget?.id : undefined
        };
      }
    }

    // If mission needs clues, play clue/search cards or uncover
    if (state.activeMission.type === 'CLUES') {
      const clueCard = bot.hand.find(c => c.type === 'CLUE' || c.type === 'CHARACTER');
      if (clueCard) {
        return {
          type: 'PLAY_CARD',
          playerId: bot.id,
          cardId: clueCard.id,
          targetPlayerId: clueCard.targetRequired ? randomTarget?.id : undefined
        };
      }
      // 30% chance to reveal clue action directly
      if (Math.random() < 0.35) {
        return {
          type: 'REVEAL_CLUE',
          playerId: bot.id
        };
      }
    }
  }

  // Standard Play: Choose a random legal card
  const cardToPlay = bot.hand[Math.floor(Math.random() * bot.hand.length)];
  return {
    type: 'PLAY_CARD',
    playerId: bot.id,
    cardId: cardToPlay.id,
    targetPlayerId: cardToPlay.targetRequired ? randomTarget?.id : undefined
  };
}
