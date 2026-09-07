import { NextResponse } from 'next/server';
import { db } from '@/db';
import { rooms, players, gameLogs, questions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { MAP_LOCATIONS, TRANSPORT_COSTS, REVEAL_ROUNDS } from '@/lib/game-data';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = await params;
  const { playerId, actionType, data } = await req.json();

  const room = await db.query.rooms.findFirst({ where: eq(rooms.id, roomId) });
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

  const player = await db.query.players.findFirst({ where: eq(players.id, playerId) });
  if (!player) return NextResponse.json({ error: 'Player not found' }, { status: 404 });

  // 1. Start Game action
  if (actionType === 'start' && player.isHost) {
    // Determine who starts
    const firstPlayer = await db.query.players.findFirst({
        where: and(eq(players.roomId, roomId), eq(players.role, 'mr_x'))
    });
    
    await db.update(rooms).set({
      status: 'playing',
      phase: 'question',
      currentTurnPlayerId: firstPlayer?.id || player.id,
      currentRound: 1,
    }).where(eq(rooms.id, roomId));
    
    return NextResponse.json({ ok: true });
  }

  // Check if it's the player's turn
  if (room.currentTurnPlayerId !== playerId) {
    return NextResponse.json({ error: 'Not your turn' }, { status: 403 });
  }

  // 2. Answer action
  if (actionType === 'answer') {
    const q = await db.query.questions.findFirst({ where: eq(questions.id, data.questionId) });
    if (!q) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    const isCorrect = q.answer.toLowerCase() === data.answer.trim().toLowerCase();
    let earned = 0;
    if (isCorrect) {
      earned = data.usedOptions ? 200 : 500;
    }

    await db.update(players).set({
      balance: player.balance + earned
    }).where(eq(players.id, playerId));

    // Transition to movement phase
    await db.update(rooms).set({ phase: 'movement' }).where(eq(rooms.id, roomId));
    return NextResponse.json({ ok: true, earned, isCorrect });
  }

  // 3. Move action
  if (actionType === 'move') {
    const { to, transport } = data;
    const cost = (TRANSPORT_COSTS as any)[transport];

    if (player.balance < cost) {
      // Skip movement if can't afford
      // but we should still advance turn
    } else {
      await db.update(players).set({
        location: to,
        balance: player.balance - cost
      }).where(eq(players.id, playerId));

      // Log movement
      await db.insert(gameLogs).values({
        roomId,
        round: room.currentRound,
        playerId,
        playerName: player.name,
        role: player.role,
        fromLocation: player.location,
        toLocation: to,
        transport,
      });

      // Update Mr. X hidden location if he moved
      if (player.role === 'mr_x') {
        const gameData = room.gameData as any;
        gameData.mrXLocation = to;
        if (REVEAL_ROUNDS.includes(room.currentRound)) {
           gameData.mrXLastRevealRound = room.currentRound;
           gameData.mrXLastRevealLocation = to;
        }
        await db.update(rooms).set({ gameData }).where(eq(rooms.id, roomId));
      }
    }

    // Check Capture Condition
    const allPlayers = await db.query.players.findMany({ 
        where: eq(players.roomId, roomId),
        orderBy: players.order 
    });
    const mrX = allPlayers.find(p => p.role === 'mr_x');
    const detectives = allPlayers.filter(p => p.role === 'detective');
    
    let winningTeam = null;
    if (mrX) {
        const isCaught = detectives.some(d => d.location === mrX.location);
        if (isCaught) {
            winningTeam = 'detectives';
        } else if (room.currentRound === 24 && player.role === 'detective' && player.order === allPlayers.length - 1) {
            winningTeam = 'mr_x';
        }
    }

    if (winningTeam) {
        await db.update(rooms).set({ 
            status: 'finished',
            gameData: { ... (room.gameData as any), winningTeam } 
        }).where(eq(rooms.id, roomId));
        return NextResponse.json({ ok: true, winningTeam });
    }

    // Advance turn or round
    const nextPlayer = allPlayers.find(p => p.order === (player.order + 1) % allPlayers.length);
    if (!nextPlayer) return NextResponse.json({ error: 'Internal error: next player not found' });

    if (nextPlayer.role === 'mr_x') {
      // New round starts
      await db.update(rooms).set({
        currentRound: room.currentRound + 1,
        currentTurnPlayerId: nextPlayer.id,
        phase: 'question'
      }).where(eq(rooms.id, roomId));
    } else {
      // Next detective's turn
      await db.update(rooms).set({
        currentTurnPlayerId: nextPlayer.id,
        phase: 'question'
      }).where(eq(rooms.id, roomId));
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
