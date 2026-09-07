import { NextResponse } from 'next/server';
import { db } from '@/db';
import { rooms, players, gameLogs, questions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = await params;
  
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
  });

  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

  const roomPlayers = await db.query.players.findMany({
    where: eq(players.roomId, roomId),
    orderBy: players.order,
  });

  const logs = await db.query.gameLogs.findMany({
    where: eq(gameLogs.roomId, roomId),
    orderBy: gameLogs.timestamp,
  });

  // Get current question if in question phase
  let currentQuestion = null;
  if (room.status === 'playing' && room.phase === 'question') {
    // In a real app, we'd store which question is active. 
    // For now, let's just pick one based on round and player index
    const allQuestions = await db.select().from(questions);
    const qIndex = (room.currentRound * 10) % allQuestions.length;
    currentQuestion = allQuestions[qIndex];
  }

  return NextResponse.json({
    room,
    players: roomPlayers,
    logs,
    currentQuestion: currentQuestion ? { 
        id: currentQuestion.id, 
        question: currentQuestion.question, 
        options: currentQuestion.options // hide answer
    } : null
  });
}
