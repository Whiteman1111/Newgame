import { Clue } from './types';

export const CLUE_REPOSITORY: Omit<Clue, 'id' | 'discoveredBy' | 'revealedToAll'>[] = [
  {
    title: 'سجل المكالمات السرية',
    titleEn: 'Encrypted Call Log',
    description: 'تم رصد اتصال مشبوه قبل بدء الجولة بدقائق.',
    descriptionEn: 'Suspicious transmission logged right before game start.',
    isReal: true,
    category: 'TIMELINE'
  },
  {
    title: 'خريطة النفق الخفي',
    titleEn: 'Secret Tunnel Blueprint',
    description: 'مخطط يوضح وجود مخرج سري تحت القاعة.',
    descriptionEn: 'Blueprint revealing an escape corridor beneath the floor.',
    isReal: true,
    category: 'LOCATION'
  },
  {
    title: 'بطاقة هوية مزيفة',
    titleEn: 'Forged Badge',
    description: 'بطاقة منسوبة لأحد الحراس لكن الرقم التسلسلي مكرر.',
    descriptionEn: 'A security badge with a duplicate serial number.',
    isReal: false, // False clue
    category: 'SUSPECT'
  },
  {
    title: 'أثر عطر نادر',
    titleEn: 'Rare Perfume Scent',
    description: 'رائحة عطر شرقي مميز تركت في موقع الحقيبة.',
    descriptionEn: 'Exotic perfume fragrance lingering by the bag.',
    isReal: true,
    category: 'OBJECT'
  },
  {
    title: 'وصل استلام وهمي',
    titleEn: 'Phantom Invoice',
    description: 'فاتورة لمكتب شحن أغلقت أبوابه منذ عامين.',
    descriptionEn: 'Shipping slip from a defunct freight company.',
    isReal: false, // False clue
    category: 'OBJECT'
  },
  {
    title: 'صورة المراقبة المشوشة',
    titleEn: 'Glitchy Surveillance Frame',
    description: 'لقطة كاميرا تبين ظل شخص يرتدي معطفاً طويلاً.',
    descriptionEn: 'CCTV still showing a figure in a trench coat.',
    isReal: true,
    category: 'SUSPECT'
  }
];

export function generateClue(discoveredBy: string): Clue {
  const index = Math.floor(Math.random() * CLUE_REPOSITORY.length);
  const template = CLUE_REPOSITORY[index];
  return {
    ...template,
    id: `clue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    discoveredBy,
    revealedToAll: false
  };
}
