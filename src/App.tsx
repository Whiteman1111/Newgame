/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GameState, Player, GameAction } from './engine/types';
import { Language } from './i18n/translations';
import { soundEngine } from './audio/soundEngine';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { LobbyView } from './components/LobbyView';
import { GameView } from './components/GameView';
import { GameOverModal } from './components/GameOverModal';
import { TutorialModal } from './components/TutorialModal';
import { DebugPanel } from './components/DebugPanel';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [isMuted, setIsMuted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const [roomCode, setRoomCode] = useState<string | null>(() => {
    return sessionStorage.getItem('lw_room_code') || null;
  });
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(() => {
    return sessionStorage.getItem('lw_player_id') || null;
  });
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'RECONNECTING' | 'IDLE'>('IDLE');

  const sseRef = useRef<EventSource | null>(null);

  // Sync session storage
  useEffect(() => {
    if (roomCode) {
      sessionStorage.setItem('lw_room_code', roomCode);
    } else {
      sessionStorage.removeItem('lw_room_code');
    }
  }, [roomCode]);

  useEffect(() => {
    if (currentPlayerId) {
      sessionStorage.setItem('lw_player_id', currentPlayerId);
    } else {
      sessionStorage.removeItem('lw_player_id');
    }
  }, [currentPlayerId]);

  // Set RTL or LTR document direction
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Connect to SSE Stream whenever roomCode and playerId are present
  useEffect(() => {
    if (!roomCode || !currentPlayerId) {
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
      setGameState(null);
      setConnectionStatus('IDLE');
      return;
    }

    setConnectionStatus('RECONNECTING');

    // 1. Initial State Fetch
    fetch(`/api/rooms/${roomCode}/state?playerId=${currentPlayerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.state) {
          setGameState(data.state);
          setConnectionStatus('CONNECTED');
        }
      })
      .catch(err => {
        console.error('Initial state fetch error:', err);
      });

    // 2. Setup Server-Sent Events (SSE)
    const eventSource = new EventSource(`/api/rooms/${roomCode}/stream?playerId=${currentPlayerId}`);
    sseRef.current = eventSource;

    eventSource.onopen = () => {
      setConnectionStatus('CONNECTED');
    };

    eventSource.onmessage = event => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.state) {
          setGameState(payload.state);
          setConnectionStatus('CONNECTED');
        }
      } catch (e) {
        // Heartbeat or malformed
      }
    };

    eventSource.onerror = () => {
      setConnectionStatus('RECONNECTING');
    };

    // 3. Fallback Poll every 3 seconds for rock-solid sync
    const pollInterval = setInterval(() => {
      if (roomCode && currentPlayerId) {
        fetch(`/api/rooms/${roomCode}/state?playerId=${currentPlayerId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.state) {
              setGameState(data.state);
            }
          })
          .catch(() => {});
      }
    }, 3000);

    return () => {
      clearInterval(pollInterval);
      eventSource.close();
      sseRef.current = null;
    };
  }, [roomCode, currentPlayerId]);

  // Handle Actions Dispatch to Server
  const handleDispatchAction = async (action: GameAction) => {
    if (!roomCode) return;
    try {
      const res = await fetch(`/api/rooms/${roomCode}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (!data.success && data.error) {
        alert(data.error);
      }
    } catch (err: any) {
      console.error('Action dispatch failed:', err);
    }
  };

  // 1. Create Room
  const handleCreateRoom = async (name: string, avatar: string) => {
    const res = await fetch('/api/rooms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostName: name, hostAvatar: avatar })
    });
    const data = await res.json();
    if (data.success) {
      setRoomCode(data.roomCode);
      setCurrentPlayerId(data.player.id);
    } else {
      throw new Error(data.error || 'فشل إنشاء الغرفة.');
    }
  };

  // 2. Join Room
  const handleJoinRoom = async (code: string, name: string, avatar: string) => {
    const res = await fetch('/api/rooms/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode: code, name, avatar })
    });
    const data = await res.json();
    if (data.success) {
      setRoomCode(data.roomCode);
      setCurrentPlayerId(data.player.id);
    } else {
      throw new Error(data.error || 'فشل الانضمام للغرفة.');
    }
  };

  // 3. Play With Bots Solo (Creates room, adds 3 bots, and starts game)
  const handlePlayWithBots = async (name: string, avatar: string) => {
    const createRes = await fetch('/api/rooms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostName: name, hostAvatar: avatar })
    });
    const createData = await createRes.json();
    if (!createData.success) throw new Error(createData.error);

    const code = createData.roomCode;
    const hostId = createData.player.id;

    // Add 3 bots
    for (let i = 0; i < 3; i++) {
      await fetch(`/api/rooms/${code}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: {
            type: 'ADD_BOT',
            playerId: hostId,
            botDifficulty: 'NORMAL'
          }
        })
      });
    }

    setRoomCode(code);
    setCurrentPlayerId(hostId);
  };

  // Leave Room
  const handleLeaveRoom = async () => {
    if (roomCode && currentPlayerId) {
      try {
        await fetch(`/api/rooms/${roomCode}/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId: currentPlayerId })
        });
      } catch (e) {}
    }
    setRoomCode(null);
    setCurrentPlayerId(null);
    setGameState(null);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Universal Top Bar */}
      <Header
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenTutorial={() => setShowTutorial(true)}
        onToggleDebug={() => setShowDebug(!showDebug)}
        roomCode={roomCode || undefined}
        playerCount={gameState?.players.length}
        onLeaveRoom={roomCode ? handleLeaveRoom : undefined}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {!roomCode || !gameState ? (
          <LandingView
            lang={lang}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onPlayWithBots={handlePlayWithBots}
            onOpenTutorial={() => setShowTutorial(true)}
          />
        ) : gameState.stage === 'LOBBY' ? (
          <LobbyView
            state={gameState}
            currentPlayerId={currentPlayerId!}
            lang={lang}
            onStartGame={() =>
              handleDispatchAction({
                type: 'START_GAME',
                playerId: currentPlayerId!
              })
            }
            onAddBot={(difficulty: 'EASY' | 'NORMAL' | 'SMART' = 'NORMAL') =>
              handleDispatchAction({
                type: 'ADD_BOT',
                playerId: currentPlayerId!,
                botDifficulty: difficulty
              })
            }
            onRemovePlayer={(targetId) =>
              handleDispatchAction({
                type: 'REMOVE_BOT',
                playerId: currentPlayerId!,
                targetPlayerId: targetId
              })
            }
            onLeaveRoom={handleLeaveRoom}
          />
        ) : (
          <GameView
            state={gameState}
            currentPlayerId={currentPlayerId!}
            lang={lang}
            onDispatchAction={handleDispatchAction}
          />
        )}
      </main>

      {/* Game Over Modal Screen */}
      {gameState && gameState.stage === 'GAME_OVER' && (
        <GameOverModal
          state={gameState}
          currentPlayerId={currentPlayerId!}
          lang={lang}
          onPlayAgain={() =>
            handleDispatchAction({
              type: 'RESET_GAME',
              playerId: currentPlayerId!
            })
          }
          onBackToHome={handleLeaveRoom}
        />
      )}

      {/* Interactive Tutorial Modal */}
      {showTutorial && (
        <TutorialModal
          lang={lang}
          onClose={() => setShowTutorial(false)}
        />
      )}

      {/* Developer Debug Panel */}
      {showDebug && (
        <DebugPanel
          state={gameState}
          lang={lang}
          onDispatchAction={handleDispatchAction}
          onClose={() => setShowDebug(false)}
        />
      )}
    </div>
  );
}
