import React, { useEffect } from 'react';
import { GameState } from '../engine/types';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { Trophy, RefreshCw, Home, CheckCircle2, XCircle, Award } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface GameOverModalProps {
  state: GameState;
  currentPlayerId: string;
  lang: Language;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  state,
  currentPlayerId,
  lang,
  onPlayAgain,
  onBackToHome
}) => {
  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  const currentPlayer = state.players.find(p => p.id === currentPlayerId);
  const isHost = currentPlayer?.role === 'HOST';

  // Play fanfare on mount
  useEffect(() => {
    if (state.teamWon) {
      soundEngine.playVictory();
    } else {
      soundEngine.playDefeat();
    }
  }, [state.teamWon]);

  // Sort players by score
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a1c25] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-auto animate-fadeIn flex flex-col gap-5">
        {/* Header Banner */}
        <div className="text-center">
          <div className="text-4xl sm:text-5xl mb-2">
            {state.teamWon ? '🏆' : '💀'}
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black mb-1 ${state.teamWon ? 'text-amber-400' : 'text-rose-400'}`}>
            {state.teamWon ? t.teamVictory : t.teamDefeat}
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            {isAr
              ? state.teamWon
                ? `أنجزتم المهمة بنجاح: "${state.activeMission.title}"!`
                : 'خرجت الفوضى عن السيطرة قبل إتمام المهمة.'
              : state.teamWon
              ? `Mission accomplished: "${state.activeMission.titleEn}"!`
              : 'Chaos surged and took over before mission completion.'}
          </p>
        </div>

        {/* Individual Score Rankings */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{t.playerRankings}</span>
          </h3>

          <div className="space-y-2">
            {sortedPlayers.map((player, idx) => {
              const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
              const isMe = player.id === currentPlayerId;
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    idx === 0
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : isMe
                      ? 'bg-white/10 border-white/20'
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold w-6 text-center">{medal}</span>
                    <span className="text-xl">{player.avatar}</span>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{player.name}</span>
                        {isMe && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 rounded">
                            {isAr ? 'أنت' : 'You'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black font-mono text-amber-400">
                      {player.score}
                    </span>
                    <span className="text-xs text-white/40 mr-1 ml-1">{isAr ? 'نقطة' : 'pts'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECRET OBJECTIVES REVEALED */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-400" />
            <span>{t.secretObjectivesRevealed}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {state.players.map(player => {
              const obj = player.secretObjective;
              return (
                <div
                  key={player.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between gap-1 text-xs"
                >
                  <div className="flex items-center justify-between gap-1 font-bold text-white">
                    <div className="flex items-center gap-1.5 truncate">
                      <span>{player.avatar}</span>
                      <span className="truncate">{player.name}</span>
                    </div>
                    {obj.completed ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        +{obj.points}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-semibold shrink-0">
                        <XCircle className="w-3 h-3" />
                        0
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-purple-300 font-medium">
                    {isAr ? obj.title : obj.titleEn}
                  </div>
                  <div className="text-[10px] text-white/60 leading-tight">
                    {isAr ? obj.description : obj.descriptionEn}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {isHost ? (
            <button
              onClick={() => {
                soundEngine.playCardPlay();
                onPlayAgain();
              }}
              className="w-full sm:flex-1 py-3.5 px-4 bg-amber-600 hover:bg-amber-500 text-black font-black rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.playAgain}</span>
            </button>
          ) : (
            <div className="text-xs text-white/50 text-center sm:text-left flex-1">
              {isAr ? 'بانتظار أن يبدأ المضيف جولة جديدة...' : 'Waiting for host to restart round...'}
            </div>
          )}

          <button
            onClick={() => {
              soundEngine.playReaction();
              onBackToHome();
            }}
            className="w-full sm:w-auto py-3.5 px-6 bg-white/5 hover:bg-white/10 text-white/90 text-xs font-semibold rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
