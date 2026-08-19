import { Mission } from './types';

export const MISSION_TEMPLATES: Omit<Mission, 'id'>[] = [
  {
    title: 'فك شفرة القضية الكبرى',
    titleEn: 'Crack the Grand Case',
    description: 'اجمعوا 6 أدلة مؤكدة لحل اللغز قبل أن ينفد الوقت أو تخرج الفوضى عن السيطرة.',
    descriptionEn: 'Collect 6 verified clues before time runs out or Chaos hits 100%.',
    targetCount: 6,
    currentCount: 0,
    type: 'CLUES',
    completed: false,
    failed: false,
    rewardScore: 50,
    penaltyChaos: 30,
    icon: 'Search'
  },
  {
    title: 'تهريب الحقيبة الغامضة',
    titleEn: 'Smuggle the Mystery Bag',
    description: 'مرروا الحقيبة الغامضة بين 4 لاعبين مختلفين لتضليل الملاحقين وإيصالها بأمان.',
    descriptionEn: 'Pass the Mystery Bag between 4 unique players safely.',
    targetCount: 4,
    currentCount: 0,
    type: 'PASS_THE_BAG',
    completed: false,
    failed: false,
    rewardScore: 45,
    penaltyChaos: 25,
    icon: 'Briefcase',
    details: { uniqueHolders: [] }
  },
  {
    title: 'ميثاق التعاون الشامل',
    titleEn: 'The Cooperation Accord',
    description: 'اجمعوا 8 رموز تعاون عبر مساعدة بعضكم البعض وتمرير البطاقات الإيجابية.',
    descriptionEn: 'Accumulate 8 cooperation tokens via positive interactions and teamwork.',
    targetCount: 8,
    currentCount: 0,
    type: 'COOPERATION',
    completed: false,
    failed: false,
    rewardScore: 60,
    penaltyChaos: 20,
    icon: 'HeartHandshake'
  },
  {
    title: 'كبح جماح الفوضى',
    titleEn: 'Chaos Containment',
    description: 'أبقوا مؤشر الفوضى تحت 40% طوال 6 أدوار متتالية عبر بطاقات التهدئة والدرع.',
    descriptionEn: 'Keep the Chaos meter strictly below 40% for 6 consecutive turns.',
    targetCount: 6,
    currentCount: 0,
    type: 'CHAOS_SURVIVAL',
    completed: false,
    failed: false,
    rewardScore: 55,
    penaltyChaos: 35,
    icon: 'ShieldCheck'
  },
  {
    title: 'حل لغز الخزنة السرية',
    titleEn: 'Unlock the Secret Vault',
    description: 'العبوا 5 بطاقات من نوع (أشياء/OBJECT) لتجميع مفاتيح الخزنة وفتحها.',
    descriptionEn: 'Play 5 OBJECT cards to collect all keys and unlock the secret vault.',
    targetCount: 5,
    currentCount: 0,
    type: 'SOLVE_PUZZLE',
    completed: false,
    failed: false,
    rewardScore: 50,
    penaltyChaos: 20,
    icon: 'Key'
  }
];

export function getRandomMission(): Mission {
  const index = Math.floor(Math.random() * MISSION_TEMPLATES.length);
  const template = MISSION_TEMPLATES[index];
  return {
    ...template,
    id: `mission_${Date.now()}_${index}`,
    currentCount: 0,
    completed: false,
    failed: false,
    details: template.details ? { ...template.details } : {}
  };
}
