import React, { useState } from 'react';
import { Play, Bot, Sparkles, HelpCircle } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { soundEngine } from '../audio/soundEngine';

interface LandingViewProps {
  lang: Language;
  onCreateRoom: (name: string, avatar: string) => Promise<void>;
  onJoinRoom: (roomCode: string, name: string, avatar: string) => Promise<void>;
  onPlayWithBots: (name: string, avatar: string) => Promise<void>;
  onOpenTutorial: () => void;
}

const AVATAR_OPTIONS = ['🕵️', '🎩', '🦊', '🦉', '🔮', '🎭', '⚡', '👑'];

export const LandingView: React.FC<LandingViewProps> = ({
  lang,
  onCreateRoom,
  onJoinRoom,
  onPlayWithBots,
  onOpenTutorial
}) => {
  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'CREATE' | 'JOIN'>('CREATE');
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = async () => {
    if (!playerName.trim()) {
      setErrorMessage(isAr ? 'الرجاء إدخال اسمك المستعار.' : 'Please enter your name.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      soundEngine.playCardPlay();
      await onCreateRoom(playerName, selectedAvatar);
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء إنشاء الغرفة.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!playerName.trim()) {
      setErrorMessage(isAr ? 'الرجاء إدخال اسمك المستعار.' : 'Please enter your name.');
      return;
    }
    if (!roomCodeInput.trim()) {
      setErrorMessage(isAr ? 'الرجاء إدخال كود الغرفة.' : 'Please enter the room code.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      soundEngine.playCardPlay();
      await onJoinRoom(roomCodeInput.trim().toUpperCase(), playerName, selectedAvatar);
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل الانضمام للغرفة.');
    } finally {
      setLoading(false);
    }
  };

  const handleBotsSolo = async () => {
    const defaultName = playerName.trim() || (isAr ? 'المحقق الذكي' : 'Detective Ace');
    setLoading(true);
    setErrorMessage('');
    try {
      soundEngine.playTurnChime();
      await onPlayWithBots(defaultName, selectedAvatar);
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل تشغيل طور الروبوتات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 max-w-4xl mx-auto">
      {/* Hero Badge & Title */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold mb-3 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'النسخة التجريبية الأصلية' : 'Original Multiplayer Edition'}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-2">
          {isAr ? 'آخر كلمة' : 'LAST WORD'}
        </h1>
        <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto font-medium">
          {t.appTagline}
        </p>
      </div>

      {/* Main Interactive Card Form */}
      <div className="w-full max-w-md bg-[#1a1c25]/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md mb-8">
        {/* Avatar Picker */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-wider">
            {isAr ? 'اختر شخصيتك:' : 'Choose Avatar:'}
          </label>
          <div className="flex items-center justify-between gap-1 bg-black/40 p-2 rounded-2xl border border-white/5">
            {AVATAR_OPTIONS.map(av => (
              <button
                key={av}
                type="button"
                onClick={() => {
                  setSelectedAvatar(av);
                  soundEngine.playReaction();
                }}
                className={`w-9 h-9 flex items-center justify-center text-xl rounded-xl transition-all ${
                  selectedAvatar === av
                    ? 'bg-amber-500/20 border-2 border-amber-500 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Player Name Input */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wider">
            {isAr ? 'اسمك في اللعبة:' : 'Your Nickname:'}
          </label>
          <input
            type="text"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            placeholder={t.yourNamePlaceholder}
            maxLength={18}
            className="w-full bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none transition-colors"
          />
        </div>

        {/* Action Tabs: Create or Join */}
        <div className="flex rounded-xl bg-black/40 p-1 border border-white/5 mb-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('CREATE');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'CREATE'
                ? 'bg-amber-600 text-black shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {t.createRoom}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('JOIN');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'JOIN'
                ? 'bg-amber-600 text-black shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {t.joinRoom}
          </button>
        </div>

        {/* Join Tab Code Input */}
        {activeTab === 'JOIN' && (
          <div className="mb-5">
            <label className="block text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wider">
              {t.roomCode}:
            </label>
            <input
              type="text"
              value={roomCodeInput}
              onChange={e => setRoomCodeInput(e.target.value.toUpperCase())}
              placeholder={t.roomCodePlaceholder}
              maxLength={6}
              className="w-full bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-2.5 text-emerald-400 font-mono tracking-widest text-center text-base focus:outline-none uppercase"
            />
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-2.5 mb-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium text-center">
            {errorMessage}
          </div>
        )}

        {/* Primary Submit Button */}
        <button
          type="button"
          disabled={loading}
          onClick={activeTab === 'CREATE' ? handleCreate : handleJoin}
          className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:opacity-50 text-black font-black rounded-xl shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-2 mb-3"
        >
          {loading ? (
            <span>{activeTab === 'CREATE' ? t.creating : t.joining}</span>
          ) : (
            <>
              <Play className="w-4 h-4 fill-black" />
              <span>{activeTab === 'CREATE' ? t.createRoom : t.enterRoom}</span>
            </>
          )}
        </button>

        {/* Fast Play with Bots */}
        <button
          type="button"
          disabled={loading}
          onClick={handleBotsSolo}
          className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white/80 font-bold text-xs rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
        >
          <Bot className="w-4 h-4 text-emerald-400" />
          <span>{t.playWithBots}</span>
        </button>
      </div>

      {/* Feature Highlight Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 w-full max-w-xl text-center">
        <div className="bg-black/20 border border-white/5 p-3 rounded-2xl backdrop-blur-sm">
          <div className="text-lg mb-0.5">🧠</div>
          <div className="text-xs font-bold text-white/80">{isAr ? 'تفكير' : 'Think'}</div>
        </div>
        <div className="bg-black/20 border border-white/5 p-3 rounded-2xl backdrop-blur-sm">
          <div className="text-lg mb-0.5">😂</div>
          <div className="text-xs font-bold text-white/80">{isAr ? 'ضحك' : 'Laugh'}</div>
        </div>
        <div className="bg-black/20 border border-white/5 p-3 rounded-2xl backdrop-blur-sm">
          <div className="text-lg mb-0.5">🤝</div>
          <div className="text-xs font-bold text-white/80">{isAr ? 'تعاون' : 'Cooperate'}</div>
        </div>
        <div className="bg-black/20 border border-white/5 p-3 rounded-2xl backdrop-blur-sm">
          <div className="text-lg mb-0.5">🎭</div>
          <div className="text-xs font-bold text-white/80">{isAr ? 'خداع' : 'Deceive'}</div>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-black/20 border border-white/5 p-3 rounded-2xl backdrop-blur-sm">
          <div className="text-lg mb-0.5">🏆</div>
          <div className="text-xs font-bold text-white/80">{isAr ? 'فوز' : 'Win'}</div>
        </div>
      </div>
    </div>
  );
};
