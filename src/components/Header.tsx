import React from 'react';
import { Volume2, VolumeX, HelpCircle, Terminal, LogOut, Copy, Check, Sparkles } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { soundEngine } from '../audio/soundEngine';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenTutorial: () => void;
  onToggleDebug: () => void;
  roomCode?: string;
  playerCount?: number;
  onLeaveRoom?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  isMuted,
  onToggleMute,
  onOpenTutorial,
  onToggleDebug,
  roomCode,
  playerCount,
  onLeaveRoom
}) => {
  const [copied, setCopied] = React.useState(false);
  const t = TRANSLATIONS[lang];

  const handleCopy = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    soundEngine.playReaction();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-16 w-full border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      {/* Zone 1: Brand & Room Code */}
      <div className="flex items-center gap-4 sm:gap-6">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-amber-500 flex items-center gap-2 select-none">
          <span>آخر كلمة</span>
          <span className="text-[10px] sm:text-xs font-normal text-white/50 border border-white/20 px-2 py-0.5 rounded hidden sm:inline">
            LAST WORD
          </span>
        </h1>

        {roomCode && (
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase text-white/40 tracking-widest leading-none">
                {t.roomCode}
              </span>
              <button
                onClick={handleCopy}
                title={t.copyCode}
                className="flex items-center gap-1.5 text-sm sm:text-base font-mono font-bold text-emerald-400 leading-none mt-0.5 hover:text-emerald-300 transition-colors"
              >
                <span>{roomCode}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/40" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Zone 2: Navigation & Status */}
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {typeof playerCount === 'number' && (
          <span className="bg-white/5 border border-white/10 text-white/80 text-xs px-3 py-1.5 rounded-full whitespace-nowrap shrink-0">
            {playerCount} {t.players}
          </span>
        )}

        <button
          onClick={onOpenTutorial}
          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">{t.howToPlay}</span>
        </button>

        <button
          onClick={onToggleMute}
          title={isMuted ? t.soundOff : t.soundOn}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/80 transition-colors shrink-0"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          onClick={onToggleLang}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white/80 rounded-full whitespace-nowrap shrink-0 transition-colors"
        >
          {lang === 'ar' ? 'EN' : 'عربي'}
        </button>

        <button
          onClick={onToggleDebug}
          title="Developer Debug Panel"
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/40 hover:text-amber-400 transition-colors shrink-0"
        >
          <Terminal className="w-4 h-4" />
        </button>

        {onLeaveRoom && (
          <button
            onClick={onLeaveRoom}
            className="px-4 py-1.5 bg-red-600/90 hover:bg-red-700 rounded-full text-xs font-bold transition-all shadow-md shadow-red-900/20 text-white shrink-0"
          >
            {t.leaveRoom}
          </button>
        )}
      </div>
    </header>
  );
};
