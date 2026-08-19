import { SecretObjective, CardType } from './types';

export const SECRET_OBJECTIVE_TEMPLATES: Omit<SecretObjective, 'id'>[] = [
  {
    title: 'عميل الفوضى السري',
    titleEn: 'Chaos Agent',
    description: 'اجعل مؤشر الفوضى يتجاوز 70% في أي وقت خلال اللعبة.',
    descriptionEn: 'Push the Chaos meter above 70% at any point during the match.',
    type: 'REACH_CHAOS_THRESHOLD',
    targetValue: 70,
    points: 30
  },
  {
    title: 'صانع السلام',
    titleEn: 'Peace Keeper',
    description: 'أنهِ اللعبة ومؤشر الفوضى أقل من 35%.',
    descriptionEn: 'Finish the game with the Chaos meter strictly below 35%.',
    type: 'KEEP_CHAOS_LOW',
    targetValue: 35,
    points: 35
  },
  {
    title: 'خبير التحريات',
    titleEn: 'Master Investigator',
    description: 'اجمع أو اكشف دليلين على الأقل بنفسك.',
    descriptionEn: 'Collect or reveal at least 2 clues yourself.',
    type: 'COLLECT_CLUES',
    targetValue: 2,
    points: 25
  },
  {
    title: 'حارس الحقيبة السري',
    titleEn: 'Bag Custodian',
    description: 'أنهِ الجولة وأنت الشخص الذي يحمل الحقيبة الغامضة.',
    descriptionEn: 'Be the active holder of the Mystery Bag when the round or game ends.',
    type: 'HOLD_BAG',
    targetValue: 1,
    points: 40
  },
  {
    title: 'رمز التعاون',
    titleEn: 'Paragon of Teamwork',
    description: 'اجمع 4 رموز تعاون شخصية عبر مساعدة ومقايضة البطاقات.',
    descriptionEn: 'Accumulate 4 personal cooperation tokens via helpful plays.',
    type: 'ACCUMULATE_COOP',
    targetValue: 4,
    points: 30
  },
  {
    title: 'عاشق الألغاز',
    titleEn: 'Puzzle Enthusiast',
    description: 'العب بطاقتين من نوع (شخصيات/CHARACTER) أو (أشياء/OBJECT).',
    descriptionEn: 'Play at least 2 CHARACTER or OBJECT type cards.',
    type: 'PLAY_CARD_TYPE',
    targetValue: 2,
    targetCardType: 'CHARACTER' as CardType,
    points: 25
  },
  {
    title: 'مثير المفاجآت',
    titleEn: 'Surprise Instigator',
    description: 'العب بطاقتين من نوع (فوضى/CHAOS) لتغيير مجرى الأحداث.',
    descriptionEn: 'Play 2 CHAOS cards to disrupt the table.',
    type: 'PLAY_CARD_TYPE',
    targetValue: 2,
    targetCardType: 'CHAOS' as CardType,
    points: 30
  },
  {
    title: 'الصديق الخفي',
    titleEn: 'Secret Guardian',
    description: 'مرر أو ساعد لاعباً آخر مرتين على الأقل دون أن تكشف سبب ذلك.',
    descriptionEn: 'Aid or trade favorably with teammates at least twice.',
    type: 'SECRET_HELPER',
    targetValue: 2,
    points: 30
  }
];

export function assignSecretObjectives(playerCount: number): SecretObjective[] {
  const shuffled = [...SECRET_OBJECTIVE_TEMPLATES].sort(() => Math.random() - 0.5);
  return Array.from({ length: playerCount }, (_, idx) => {
    const template = shuffled[idx % shuffled.length];
    return {
      ...template,
      id: `obj_${Date.now()}_${idx}`,
      completed: false
    };
  });
}
