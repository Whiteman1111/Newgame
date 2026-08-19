import React from 'react';
import { GameState, Player } from '../engine/types';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { Users, Play, Plus, Trash2, Copy, Check, Crown, Bot, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface LobbyViewProps {
  state: GameState;
  currentPlayerId: string;
  lang: Language;
  onStartGame: () => void;
  onAddBot: (difficulty?: 'EASY' | 'NORMAL' | 'SMART') => void;
  onRemovePlayer: (playerId: string) => void;
  onLeaveRoom: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  state,
  currentPlayerId,
  lang,
  onStartGame,
  onAddBot,
  onRemovePlayer,
  onLeaveRoom
}) => {
  const [copied, setCopied] = React.useState(false);
  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  const currentPlayer = state.players.find(p => p.id === currentPlayerId);
  const isHost = currentPlayer?.role === 'HOST';
  const canStart = state.players.length >= 2;

  const handleCopy = () => {
    navigator.clipboard.writeText(state.roomCode);
    setCopied(true);
    soundEngine.playReaction();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col gap-5">
      {/* Room Code Card */}
      <div className="bg-[#1a1c25]/80 border border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
          {t.roomCode}
        </div>
        <div className="text-4xl sm:text-6xl font-black font-mono tracking-widest text-emerald-400 my-2 select-all drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          {state.roomCode}
        </div>
        <p className="text-xs text-white/60 mb-4">
          {t.shareCodeHint}
        </p>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/90 text-xs font-semibold px-5 py-2.5 rounded-xl border border-white/10 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/50" />}
          <span>{copied ? t.copied : t.copyCode}</span>
        </button>
      </div>

      {/* Players List Card */}
      <div className="bg-[#1a1c25]/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              {t.players} ({state.players.length} / 8)
            </h3>
          </div>

          {isHost && state.players.length < 8 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundEngine.playCardPlay();
                  onAddBot('NORMAL');
                }}
                className="flex items-center gap-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-medium px-3.5 py-2 rounded-xl transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <Bot className="w-3.5 h-3.5" />
                <span>{t.addBot}</span>
              </button>
            </div>
          )}
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {state.players.map(player => {
            const isMe = player.id === currentPlayerId;
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isMe
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                    : 'bg-black/30 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                    {player.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">
                        {player.name}
                      </span>
                      {isMe && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 rounded">
                          {isAr ? 'أنت' : 'You'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {player.role === 'HOST' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-400">
                          <Crown className="w-3 h-3" />
                          {t.host}
                        </span>
                      )}
                      {player.isBot && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400">
                          <Bot className="w-3 h-3" />
                          BOT
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
                        <span className={`w-1.5 h-1.5 rounded-full ${player.isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {player.isConnected ? t.connected : t.reconnecting}
                      </span>
                    </div>
                  </div>
                </div>

                {isHost && (player.isBot || !isMe) && (
                  <button
                    onClick={() => {
                      soundEngine.playReaction();
                      onRemovePlayer(player.id);
                    }}
                    title={t.removeBot}
                    className="p-2 text-white/30 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Start Game Action */}
        {isHost ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                soundEngine.playTurnChime();
                onStartGame();
              }}
              disabled={!canStart}
              className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:opacity-40 disabled:pointer-events-none text-black text-base font-black rounded-2xl shadow-xl shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>{t.startGame}</span>
            </button>
            {!canStart && (
              <p className="text-center text-xs text-amber-400 font-medium">
                {t.minPlayersNotice}
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
            <div className="inline-block animate-pulse text-amber-400 text-sm font-bold mb-1">
              {isAr ? 'بانتظار أن يبدأ المضيف اللعبة...' : 'Waiting for host to start game...'}
            </div>
            <p className="text-xs text-white/50">
              {isAr ? 'تأكد من أن جميع أصدقائك انضموا قبل الانطلاق!' : 'Make sure all teammates have joined!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
