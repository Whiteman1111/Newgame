import React, { useState } from 'react';
import { GameState, GameAction } from '../engine/types';
import { Terminal, X, FastForward, Flame, Bot, Play, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface DebugPanelProps {
  state?: GameState | null;
  lang: Language;
  onDispatchAction?: (action: GameAction) => void;
  onClose: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  state,
  lang,
  onDispatchAction,
  onClose
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const t = TRANSLATIONS[lang];

  if (!state) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 sm:w-96 bg-slate-950/95 border border-amber-500/50 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-mono overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Terminal className="w-4 h-4" />
          <span>DEV DEBUG PANEL</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-slate-400 hover:text-slate-200"
          >
            {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-rose-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-3 text-slate-300 max-h-96 overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800 text-[11px]">
            <div>Stage: <span className="text-amber-300 font-bold">{state.stage}</span></div>
            <div>Round: <span className="text-amber-300 font-bold">{state.round}/{state.maxRounds}</span></div>
            <div>Chaos: <span className="text-rose-400 font-bold">{state.chaosMeter}%</span></div>
            <div>Deck Count: <span className="text-emerald-400 font-bold">{state.deckCount}</span></div>
            <div className="col-span-2 truncate">
              Active: <span className="text-slate-100">{state.players.find(p => p.id === state.activePlayerId)?.name || 'N/A'}</span>
            </div>
          </div>

          {/* Developer Fast Action Buttons */}
          {onDispatchAction && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Quick Testing Actions:</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onDispatchAction({ type: 'DEV_FAST_FORWARD', playerId: state.activePlayerId })}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 flex items-center justify-center gap-1"
                >
                  <FastForward className="w-3 h-3 text-amber-400" />
                  <span>Next Turn</span>
                </button>

                <button
                  onClick={() => onDispatchAction({ type: 'ADD_BOT', playerId: state.activePlayerId, botDifficulty: 'SMART' })}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 flex items-center justify-center gap-1"
                >
                  <Bot className="w-3 h-3 text-emerald-400" />
                  <span>+ Smart Bot</span>
                </button>

                <button
                  onClick={() => onDispatchAction({ type: 'DEV_SET_CHAOS', playerId: state.activePlayerId, payload: { chaos: 95 } })}
                  className="p-1.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg flex items-center justify-center gap-1"
                >
                  <Flame className="w-3 h-3" />
                  <span>Chaos 95%</span>
                </button>

                <button
                  onClick={() => onDispatchAction({ type: 'DEV_SET_CHAOS', playerId: state.activePlayerId, payload: { chaos: 0 } })}
                  className="p-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-lg flex items-center justify-center gap-1"
                >
                  <span>Reset Chaos 0%</span>
                </button>
              </div>
            </div>
          )}

          {/* Raw State JSON Toggle */}
          <div>
            <button
              onClick={() => setShowJson(!showJson)}
              className="text-[10px] text-amber-400 underline hover:text-amber-300"
            >
              {showJson ? 'Hide Raw JSON' : 'Inspect Raw JSON State'}
            </button>
            {showJson && (
              <pre className="mt-1 p-2 bg-slate-950 rounded-lg border border-slate-800 text-[9px] text-slate-400 max-h-40 overflow-auto">
                {JSON.stringify(state, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
