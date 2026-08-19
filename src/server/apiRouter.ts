import { Request, Response, Router } from 'express';
import { roomManager } from '../engine/roomManager';
import { maskGameStateForPlayer } from '../engine/rules';

export const apiRouter = Router();

// 1. Create Room
apiRouter.post('/rooms/create', (req: Request, res: Response) => {
  try {
    const { hostName, hostAvatar } = req.body || {};
    const { room, host } = roomManager.createRoom(hostName, hostAvatar);
    res.json({
      success: true,
      roomCode: room.roomCode,
      roomId: room.roomId,
      player: host
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 2. Join Room
apiRouter.post('/rooms/join', (req: Request, res: Response) => {
  try {
    const { roomCode, name, avatar } = req.body || {};
    if (!roomCode) {
      return res.status(400).json({ success: false, error: 'كود الغرفة مطلوب.' });
    }
    const room = roomManager.getRoom(roomCode);
    if (!room) {
      return res.status(404).json({ success: false, error: 'لم يتم العثور على الغرفة. تأكد من الكود.' });
    }
    const player = room.joinPlayer(name, avatar);
    res.json({
      success: true,
      roomCode: room.roomCode,
      roomId: room.roomId,
      player
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 3. Get State Snapshot
apiRouter.get('/rooms/:roomCode/state', (req: Request, res: Response) => {
  const { roomCode } = req.params;
  const playerId = (req.query.playerId as string) || '';
  const room = roomManager.getRoom(roomCode);
  if (!room) {
    return res.status(404).json({ success: false, error: 'الغرفة غير موجودة.' });
  }
  const maskedState = maskGameStateForPlayer(room.state, playerId);
  res.json({ success: true, state: maskedState });
});

// 4. Server-Sent Events (SSE) Real-Time Stream
apiRouter.get('/rooms/:roomCode/stream', (req: Request, res: Response) => {
  const { roomCode } = req.params;
  const playerId = (req.query.playerId as string) || '';
  const room = roomManager.getRoom(roomCode);

  if (!room) {
    return res.status(404).end('Room not found');
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial connected event
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', state: maskGameStateForPlayer(room.state, playerId) })}\n\n`);

  // Subscribe to room updates
  const updateCallback = (maskedState: any) => {
    res.write(`data: ${JSON.stringify({ type: 'STATE_UPDATE', state: maskedState })}\n\n`);
  };

  room.subscribe(playerId, updateCallback);

  // Keep-alive heartbeat every 20s
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    room.unsubscribe(playerId);
  });
});

// 5. Dispatch Action
apiRouter.post('/rooms/:roomCode/action', (req: Request, res: Response) => {
  const { roomCode } = req.params;
  const { action } = req.body || {};
  const room = roomManager.getRoom(roomCode);

  if (!room) {
    return res.status(404).json({ success: false, error: 'الغرفة غير موجودة.' });
  }

  if (!action) {
    return res.status(400).json({ success: false, error: 'الحركة غير محددة.' });
  }

  const result = room.dispatchAction(action);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// 6. Leave Room
apiRouter.post('/rooms/:roomCode/leave', (req: Request, res: Response) => {
  const { roomCode } = req.params;
  const { playerId } = req.body || {};
  const room = roomManager.getRoom(roomCode);
  if (room && playerId) {
    room.removePlayer(playerId);
  }
  res.json({ success: true });
});
