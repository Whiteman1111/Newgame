import React, { useState, useEffect } from 'react';
import { GameState, Card, Player, GameAction } from '../engine/types';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { CardComponent } from './CardComponent';
import { 
  Flame, 
  Search, 
  Send, 
  Eye, 
  EyeOff, 
  Briefcase, 
  Bot, 
  MessageSquare, 
  ScrollText, 
  Smile, 
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface GameViewProps {
  state: GameState;
  currentPlayerId: string;
  lang: Language;
  onDispatchAction: (action: GameAction) => void;
}

const REACTION_EMOJIS = ['😂', '😱', '🤔', '👀', '🔥', '😭', '👏', '❓'];

export const GameView: React.FC<GameViewProps> = ({
  state,
  currentPlayerId,
  lang,
  onDispatchAction
}) => {
  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showSecretObjective, setShowSecretObjective] = useState(true);
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [pendingCardToPlay, setPendingCardToPlay] = useState<Card | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [activeSideTab, setActiveSideTab] = useState<'LOG' | 'CHAT'>('LOG');

  const me = state.players.find(p => p.id === currentPlayerId);
  const isMyTurn = state.activePlayerId === currentPlayerId;
  const activePlayer = state.players.find(p => p.id === state.activePlayerId);

  // Play chime on turn start
  useEffect(() => {
    if (isMyTurn) {
      soundEngine.playTurnChime();
    }
  }, [state.activePlayerId, isMyTurn]);

  // Audio trigger on chaos spikes
  useEffect(() => {
    if (state.chaosMeter >= 75) {
      soundEngine.playChaosAlert();
    }
  }, [state.chaosMeter]);

  const handleSelectCard = (card: Card) => {
    if (selectedCardId === card.id) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(card.id);
      soundEngine.playCardDraw();
    }
  };

  const handlePlayCard = (card: Card) => {
    if (!isMyTurn) return;

    if (card.targetRequired) {
      setPendingCardToPlay(card);
      setTargetModalOpen(true);
    } else {
      soundEngine.playCardPlay();
      onDispatchAction({
        type: 'PLAY_CARD',
        playerId: currentPlayerId,
        cardId: card.id
      });
      setSelectedCardId(null);
    }
  };

  const handleConfirmTarget = (targetPlayerId: string) => {
    if (!pendingCardToPlay) return;
    soundEngine.playCardPlay();
    onDispatchAction({
      type: 'PLAY_CARD',
      playerId: currentPlayerId,
      cardId: pendingCardToPlay.id,
      targetPlayerId
    });
    setTargetModalOpen(false);
    setPendingCardToPlay(null);
    setSelectedCardId(null);
  };

  const handleDrawCard = () => {
    if (!isMyTurn) return;
    soundEngine.playCardDraw();
    onDispatchAction({
      type: 'DRAW_CARD',
      playerId: currentPlayerId
    });
  };

  const handlePassTurn = () => {
    if (!isMyTurn) return;
    soundEngine.playCardPlay();
    onDispatchAction({
      type: 'PASS_TURN',
      playerId: currentPlayerId
    });
  };

  const handleRevealClue = () => {
    if (!isMyTurn) return;
    soundEngine.playCardPlay();
    onDispatchAction({
      type: 'REVEAL_CLUE',
      playerId: currentPlayerId
    });
  };

  const handleSendReaction = (emoji: string) => {
    soundEngine.playReaction();
    onDispatchAction({
      type: 'SEND_REACTION',
      playerId: currentPlayerId,
      emoji
    });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    soundEngine.playReaction();
    onDispatchAction({
      type: 'SEND_CHAT',
      playerId: currentPlayerId,
      text: chatInput.trim()
    });
    setChatInput('');
  };

  const otherPlayers = state.players.filter(p => p.id !== currentPlayerId);

  // Rotation fan classes for bottom cards
  const getFanRotation = (index: number, total: number) => {
    if (total <= 1) return 'rotate-0';
    const mid = (total - 1) / 2;
    const offset = index - mid;
    if (offset < -1.5) return '-rotate-6';
    if (offset < 0) return '-rotate-2';
    if (offset === 0) return 'rotate-0';
    if (offset <= 1.5) return 'rotate-2';
    return 'rotate-6';
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] w-full max-w-[1400px] mx-auto p-2 sm:p-4 gap-3 relative">
      {/* MAIN 3-COLUMN ARENA */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 relative">
        {/* LEFT SECTION: GAME LOG & CHAT */}
        <section className="w-full lg:w-64 bg-black/20 border border-white/5 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md h-72 lg:h-[480px]">
          {/* Tab Switcher */}
          <div className="p-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <button
              onClick={() => setActiveSideTab('LOG')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSideTab === 'LOG' ? 'bg-white/10 text-amber-400' : 'text-white/50 hover:text-white'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>{t.gameLog}</span>
            </button>
            <button
              onClick={() => setActiveSideTab('CHAT')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSideTab === 'CHAT' ? 'bg-white/10 text-amber-400' : 'text-white/50 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.chat} ({state.messages.length})</span>
            </button>
          </div>

          {/* Tab 1: Game Log */}
          {activeSideTab === 'LOG' && (
            <div className="flex-1 p-3 space-y-2.5 overflow-y-auto text-xs">
              {state.gameLogs.map(log => (
                <div
                  key={log.id}
                  className={`p-2 rounded-xl border leading-relaxed ${
                    log.type === 'CHAOS'
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                      : log.type === 'MISSION'
                      ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                      : log.type === 'CLUE'
                      ? 'bg-yellow-950/40 border-yellow-500/30 text-yellow-200'
                      : 'bg-white/5 border-white/5 text-white/80'
                  }`}
                >
                  {isAr ? log.text : log.textEn}
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Chat */}
          {activeSideTab === 'CHAT' && (
            <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden gap-2">
              <div className="flex-1 overflow-y-auto space-y-2 text-xs">
                {state.messages.map(msg => (
                  <div key={msg.id} className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-1 font-bold text-amber-400 mb-0.5">
                      <span>{msg.playerAvatar}</span>
                      <span>{msg.playerName}</span>
                    </div>
                    <div className="text-white/90 break-words">{msg.text}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-1.5 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder={t.typeMessage}
                  maxLength={80}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 p-2 rounded-lg text-black font-bold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Quick Reactions Footer */}
          <div className="p-2 border-t border-white/5 bg-white/5 flex items-center justify-between gap-1">
            {REACTION_EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSendReaction(emoji)}
                className="w-7 h-7 flex items-center justify-center text-sm rounded-lg hover:bg-white/10 hover:scale-110 active:scale-95 transition-all"
              >
                {emoji}
              </button>
            ))}
          </div>
        </section>

        {/* CENTER SECTION: TABLETOP ARENA */}
        <section className="flex-1 relative flex flex-col items-center justify-between min-h-[460px] bg-black/10 border border-white/5 rounded-3xl p-4 overflow-hidden backdrop-blur-sm">
          {/* Floating Mission Banner */}
          <div className="w-full max-w-lg bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 backdrop-blur-md shadow-xl z-20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center text-xl shrink-0">
                🎯
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-wider truncate">
                    {t.mission}: {isAr ? state.activeMission.title : state.activeMission.titleEn}
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-600/40 shrink-0">
                    {state.activeMission.currentCount} / {state.activeMission.targetCount}
                  </span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-medium line-clamp-2">
                  {isAr ? state.activeMission.description : state.activeMission.descriptionEn}
                </p>
              </div>
            </div>
          </div>

          {/* OVAL ARENA TABLE */}
          <div className="w-full max-w-[580px] h-[300px] sm:h-[330px] rounded-[100%] border-2 border-white/5 shadow-[0_0_100px_rgba(245,158,11,0.06)] relative flex items-center justify-center my-3 bg-radial from-slate-900/40 to-transparent">
            {/* Top Seated Player */}
            {otherPlayers[0] && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20">
                <div className={`w-14 h-14 rounded-full border-2 bg-gray-800 flex items-center justify-center text-2xl shadow-lg relative ${
                  state.activePlayerId === otherPlayers[0].id ? 'border-amber-500 ring-2 ring-amber-400' : 'border-white/20'
                }`}>
                  <span>{otherPlayers[0].avatar}</span>
                  {state.currentSpecialHolderId === otherPlayers[0].id && (
                    <span className="absolute -bottom-1 -right-1 text-sm animate-pulse">🎒</span>
                  )}
                </div>
                <span className="text-xs font-bold bg-black/80 px-2.5 py-0.5 rounded-full border border-white/10 truncate max-w-[110px]">
                  {otherPlayers[0].name}
                </span>
              </div>
            )}

            {/* Right Seated Player */}
            {otherPlayers[1] && (
              <div className="absolute top-1/2 -right-4 -translate-y-1/2 flex flex-col items-center gap-1 z-20">
                <div className={`w-14 h-14 rounded-full border-2 bg-gray-800 flex items-center justify-center text-2xl shadow-lg relative ${
                  state.activePlayerId === otherPlayers[1].id ? 'border-amber-500 ring-2 ring-amber-400' : 'border-white/20'
                }`}>
                  <span>{otherPlayers[1].avatar}</span>
                  {state.currentSpecialHolderId === otherPlayers[1].id && (
                    <span className="absolute -bottom-1 -right-1 text-sm animate-pulse">🎒</span>
                  )}
                </div>
                <span className="text-xs font-bold bg-black/80 px-2.5 py-0.5 rounded-full border border-white/10 truncate max-w-[110px]">
                  {otherPlayers[1].name}
                </span>
              </div>
            )}

            {/* Left Seated Player */}
            {otherPlayers[2] && (
              <div className="absolute top-1/2 -left-4 -translate-y-1/2 flex flex-col items-center gap-1 z-20">
                <div className={`w-14 h-14 rounded-full border-2 bg-gray-800 flex items-center justify-center text-2xl shadow-lg relative ${
                  state.activePlayerId === otherPlayers[2].id ? 'border-amber-500 ring-2 ring-amber-400' : 'border-white/20'
                }`}>
                  <span>{otherPlayers[2].avatar}</span>
                  {state.currentSpecialHolderId === otherPlayers[2].id && (
                    <span className="absolute -bottom-1 -right-1 text-sm animate-pulse">🎒</span>
                  )}
                </div>
                <span className="text-xs font-bold bg-black/80 px-2.5 py-0.5 rounded-full border border-white/10 truncate max-w-[110px]">
                  {otherPlayers[2].name}
                </span>
              </div>
            )}

            {/* Center Table Deck & Discard */}
            <div className="flex items-center gap-4 z-10">
              {/* Draw Deck */}
              <div
                onClick={isMyTurn ? handleDrawCard : undefined}
                className={`w-28 sm:w-32 h-36 sm:h-44 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center transform rotate-3 shadow-2xl relative transition-all ${
                  isMyTurn ? 'cursor-pointer hover:border-amber-500 hover:scale-105 active:scale-95' : 'opacity-85'
                }`}
              >
                <div className="absolute inset-2 border border-white/10 rounded-lg border-dashed"></div>
                <span className="text-white/30 font-black text-2xl transform -rotate-12 select-none">Deck</span>
                <span className="text-[11px] font-mono font-bold text-amber-400 mt-2 z-10">
                  {state.deckCount} {t.cardsCount}
                </span>
              </div>

              {/* Discard Pile */}
              <div className="w-28 sm:w-32 h-36 sm:h-44 bg-black/40 border border-white/10 rounded-xl flex flex-col items-center justify-center p-2 text-center shadow-inner">
                {state.discardPile.length > 0 ? (
                  <>
                    <span className="text-[10px] text-white/40 uppercase mb-1">{isAr ? 'آخر ملعوب' : 'Discarded'}</span>
                    <span className="text-xs font-bold text-amber-400 line-clamp-2 px-1">
                      {isAr ? state.discardPile[0].name : state.discardPile[0].nameEn}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-white/30">{isAr ? 'فارغة' : 'Empty'}</span>
                )}
              </div>
            </div>

            {/* Current Player Seat (Bottom of Oval) */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20">
              <div className={`w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-3xl transition-all relative ${
                isMyTurn 
                  ? 'border-4 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.45)] scale-105' 
                  : 'border-2 border-white/20'
              }`}>
                <span>{me?.avatar || '🕵️'}</span>
                {state.currentSpecialHolderId === me?.id && (
                  <span className="absolute -bottom-1 -right-1 text-base animate-pulse">🎒</span>
                )}
              </div>
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full transition-all ${
                isMyTurn ? 'bg-amber-500 text-black animate-pulse font-black shadow-md' : 'bg-black/80 border border-white/10 text-white'
              }`}>
                {isMyTurn ? t.yourTurn : (me?.name || 'أنت')}
              </span>
            </div>
          </div>

          <div className="h-2"></div>
        </section>

        {/* RIGHT SECTION: SECRET OBJECTIVE & ROUND STATS */}
        <section className="w-full lg:w-72 flex flex-col gap-3">
          {/* Secret Objective Card */}
          {me?.secretObjective && (
            <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl backdrop-blur-sm relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-purple-400 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-1">
                  <span>{t.secretObjective}</span>
                  <span>🔒</span>
                </h4>
                <span className="text-[10px] text-purple-300 font-bold bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/30">
                  +{me.secretObjective.points} pts
                </span>
              </div>
              <h5 className="text-xs font-bold text-white mb-1">
                {isAr ? me.secretObjective.title : me.secretObjective.titleEn}
              </h5>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                {isAr ? me.secretObjective.description : me.secretObjective.descriptionEn}
              </p>
            </div>
          )}

          {/* Round Stats & Chaos Level */}
          <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-white/40 uppercase mb-3">
              {isAr ? 'إحصائيات الجولة' : 'Match Overview'}
            </h3>

            <div className="space-y-3">
              {/* Chaos Gauge */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-white/60">{t.chaosMeter}</span>
                  <span className="text-sm font-bold text-orange-500 font-mono">{state.chaosMeter}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-orange-600 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${state.chaosMeter}%` }}
                  />
                </div>
              </div>

              {/* Clues Count */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-white/60">{isAr ? 'الأدلة المكتشفة' : 'Clues Found'}</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {me?.cluesCollected.length || 0}
                  </span>
                </div>
              </div>

              {/* Cooperation */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">{isAr ? 'نقاط التعاون' : 'Cooperation'}</span>
                <span className="text-sm font-bold text-blue-400 font-mono">
                  {me?.cooperationTokens || 0} 🤝
                </span>
              </div>

              {/* Personal Score */}
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-xs text-white/60">{isAr ? 'رصيدك الحالي' : 'Your Score'}</span>
                <span className="text-lg font-black text-amber-500 font-mono">
                  {me?.score || 0} pts
                </span>
              </div>
            </div>

            <button
              disabled={!isMyTurn}
              onClick={handleRevealClue}
              className="mt-3 w-full py-2 bg-yellow-950/40 hover:bg-yellow-900/60 border border-yellow-500/30 text-yellow-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t.revealClue}</span>
            </button>
          </div>
        </section>
      </div>

      {/* BOTTOM FOOTER: CARDS FAN & ACTION BUTTONS */}
      <footer className="w-full bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-4 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-lg">
        {/* Hand Cards Fan */}
        <div className="flex items-end justify-center gap-2 sm:gap-3 overflow-x-auto py-2 px-2 no-scrollbar w-full md:w-auto">
          {me?.hand && me.hand.length > 0 ? (
            me.hand.map((card, idx) => (
              <CardComponent
                key={card.id}
                card={card}
                isSelected={selectedCardId === card.id}
                isPlayable={isMyTurn}
                onClick={() => handleSelectCard(card)}
                lang={lang}
                size="md"
                rotationClass={getFanRotation(idx, me.hand.length)}
              />
            ))
          ) : (
            <div className="text-xs text-white/40 py-6">
              {isAr ? 'لا تملك أي بطاقات حالياً. اسحب بطاقة في دورك!' : 'No cards in hand. Draw a card!'}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto justify-center">
          <button
            disabled={!isMyTurn || !selectedCardId}
            onClick={() => {
              const card = me?.hand.find(c => c.id === selectedCardId);
              if (card) handlePlayCard(card);
            }}
            className="flex-1 md:flex-initial px-6 sm:px-8 py-3 bg-amber-600 hover:bg-amber-500 text-black font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-600/20 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {t.playCard}
          </button>

          <button
            disabled={!isMyTurn}
            onClick={handlePassTurn}
            className="flex-1 md:flex-initial px-6 sm:px-8 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors disabled:opacity-40"
          >
            {t.passTurn}
          </button>
        </div>
      </footer>

      {/* TARGET PLAYER MODAL */}
      {targetModalOpen && pendingCardToPlay && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1c25] border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
            <h3 className="text-base font-bold text-white mb-2">
              {t.targetSelectTitle}
            </h3>
            <p className="text-xs text-white/60 mb-4">
              {isAr ? `تتطلب بطاقة [${pendingCardToPlay.name}] تحديد لاعب مستهدف.` : `Card [${pendingCardToPlay.nameEn}] requires a target player.`}
            </p>

            <div className="space-y-2 mb-4">
              {state.players
                .filter(p => p.id !== currentPlayerId)
                .map(player => (
                  <button
                    key={player.id}
                    onClick={() => handleConfirmTarget(player.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/50 text-white transition-all text-sm font-bold"
                  >
                    <span className="text-xl">{player.avatar}</span>
                    <span>{player.name}</span>
                  </button>
                ))}
            </div>

            <button
              onClick={() => {
                setTargetModalOpen(false);
                setPendingCardToPlay(null);
              }}
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
