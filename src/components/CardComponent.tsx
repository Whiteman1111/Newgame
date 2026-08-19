import React from 'react';
import { Card, CardType } from '../engine/types';
import { 
  Search, 
  Shield, 
  Eye, 
  Briefcase, 
  Sparkles, 
  CloudFog, 
  Key, 
  FlaskConical, 
  ZapOff, 
  Wind, 
  Feather, 
  Users, 
  RefreshCw, 
  Hand, 
  HeartHandshake, 
  Layers, 
  Lock, 
  FileText, 
  VenetianMask, 
  MessageSquareShare, 
  Flame, 
  Dices, 
  Shuffle, 
  Bomb, 
  Award, 
  Puzzle, 
  ShieldCheck, 
  Fingerprint, 
  FileSpreadsheet, 
  KeyRound, 
  CassetteTape, 
  UserCheck, 
  Stamp,
  Coins
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface CardComponentProps {
  card: Card;
  isSelected?: boolean;
  isPlayable?: boolean;
  onClick?: () => void;
  lang?: Language;
  size?: 'sm' | 'md' | 'lg';
  rotationClass?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Search: <Search className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Eye: <Eye className="w-8 h-8" />,
  Briefcase: <Briefcase className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
  CloudFog: <CloudFog className="w-8 h-8" />,
  Key: <Key className="w-8 h-8" />,
  FlaskConical: <FlaskConical className="w-8 h-8" />,
  ZapOff: <ZapOff className="w-8 h-8" />,
  Wind: <Wind className="w-8 h-8" />,
  Feather: <Feather className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  RefreshCw: <RefreshCw className="w-8 h-8" />,
  Hand: <Hand className="w-8 h-8" />,
  HeartHandshake: <HeartHandshake className="w-8 h-8" />,
  Layers: <Layers className="w-8 h-8" />,
  Lock: <Lock className="w-8 h-8" />,
  FileText: <FileText className="w-8 h-8" />,
  VenetianMask: <VenetianMask className="w-8 h-8" />,
  MessageSquareShare: <MessageSquareShare className="w-8 h-8" />,
  Flame: <Flame className="w-8 h-8" />,
  Dices: <Dices className="w-8 h-8" />,
  Shuffle: <Shuffle className="w-8 h-8" />,
  Bomb: <Bomb className="w-8 h-8" />,
  Award: <Award className="w-8 h-8" />,
  Puzzle: <Puzzle className="w-8 h-8" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8" />,
  Fingerprint: <Fingerprint className="w-8 h-8" />,
  FileSpreadsheet: <FileSpreadsheet className="w-8 h-8" />,
  KeyRound: <KeyRound className="w-8 h-8" />,
  CassetteTape: <CassetteTape className="w-8 h-8" />,
  UserCheck: <UserCheck className="w-8 h-8" />,
  Stamp: <Stamp className="w-8 h-8" />,
  Coins: <Coins className="w-8 h-8" />,
  Masks: <VenetianMask className="w-8 h-8" />
};

export const TYPE_CONFIG: Record<CardType, { colorText: string; bgBox: string; labelAr: string; labelEn: string }> = {
  CHARACTER: {
    colorText: 'text-emerald-400',
    bgBox: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    labelAr: 'شخصية',
    labelEn: 'CHARACTER'
  },
  OBJECT: {
    colorText: 'text-amber-400',
    bgBox: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    labelAr: 'أداة',
    labelEn: 'OBJECT'
  },
  EVENT: {
    colorText: 'text-blue-400',
    bgBox: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    labelAr: 'حدث',
    labelEn: 'EVENT'
  },
  ACTION: {
    colorText: 'text-sky-400',
    bgBox: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    labelAr: 'حركة',
    labelEn: 'ACTION'
  },
  SECRET: {
    colorText: 'text-purple-400',
    bgBox: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    labelAr: 'سر',
    labelEn: 'SECRET'
  },
  CHAOS: {
    colorText: 'text-rose-400',
    bgBox: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    labelAr: 'فوضى',
    labelEn: 'CHAOS'
  },
  COOPERATION: {
    colorText: 'text-teal-400',
    bgBox: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
    labelAr: 'تعاون',
    labelEn: 'COOPERATION'
  },
  CLUE: {
    colorText: 'text-yellow-400',
    bgBox: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    labelAr: 'دليل',
    labelEn: 'CLUE'
  }
};

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  isSelected = false,
  isPlayable = true,
  onClick,
  lang = 'ar',
  size = 'md',
  rotationClass = ''
}) => {
  const config = TYPE_CONFIG[card.type] || TYPE_CONFIG.OBJECT;
  const isAr = lang === 'ar';

  const sizeClasses = {
    sm: 'w-32 h-44 p-2 text-xs',
    md: 'w-36 sm:w-40 h-52 sm:h-56 p-3 text-sm',
    lg: 'w-48 h-68 p-4 text-base'
  }[size];

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      className={`
        group relative select-none flex flex-col justify-between rounded-xl transition-all duration-300
        ${sizeClasses}
        bg-[#1a1c25]
        ${isSelected 
          ? 'border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] -translate-y-5 z-40 rotate-0' 
          : 'border border-white/20 hover:-translate-y-4 hover:rotate-0 hover:z-30 hover:border-white/40 shadow-2xl'}
        ${isPlayable ? 'cursor-pointer' : 'opacity-80'}
        ${rotationClass}
        overflow-hidden backdrop-blur-sm
      `}
    >
      {/* Top Bar with Type */}
      <div className="flex items-center justify-between z-10">
        <span className={`text-[10px] font-black uppercase tracking-wider ${config.colorText}`}>
          {isAr ? config.labelAr : config.labelEn}
        </span>
        {card.rarity === 'LEGENDARY' && (
          <span className="text-[9px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40">
            ★ نادرة
          </span>
        )}
      </div>

      {/* Art Box */}
      <div className={`w-full h-16 sm:h-20 rounded-lg flex items-center justify-center my-1.5 transition-transform group-hover:scale-105 ${config.bgBox}`}>
        {ICON_MAP[card.icon] || <Sparkles className="w-8 h-8" />}
      </div>

      {/* Title & Desc */}
      <div className="my-auto">
        <h5 className="text-xs sm:text-sm font-bold text-white mb-0.5 line-clamp-1">
          {isAr ? card.name : card.nameEn}
        </h5>
        <p className="text-[10px] sm:text-[11px] text-white/60 leading-tight line-clamp-2">
          {isAr ? card.description : card.descriptionEn}
        </p>
      </div>

      {/* Bottom stats indicators */}
      <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-medium text-white/50">
        {card.chaosImpact !== 0 ? (
          <span className={card.chaosImpact > 0 ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
            فوضى {card.chaosImpact > 0 ? `+${card.chaosImpact}%` : `${card.chaosImpact}%`}
          </span>
        ) : (
          <span>فوضى 0%</span>
        )}

        {card.cooperationImpact > 0 && (
          <span className="text-teal-400 font-semibold flex items-center gap-0.5">
            +{card.cooperationImpact} 🤝
          </span>
        )}
      </div>
    </div>
  );
};
