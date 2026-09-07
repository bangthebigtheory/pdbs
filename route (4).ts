import { NextResponse } from 'next/server';
import { db } from '@/db';
import { rooms, players } from '@/db/schema';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  const { hostName, playerCount } = await req.json();
  const roomCode = 'BLR-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  const hostId = nanoid();

  await db.insert(rooms).values({
    id: roomCode,
    status: 'waiting',
    maxRounds: 24,
    gameData: {
      mrXLocation: 'Majestic',
      mrXLastRevealRound: 0,
      mrXLastRevealLocation: 'Majestic',
    },
  });

  await db.insert(players).values({
    id: hostId,
    roomId: roomCode,
    name: hostName,
    role: 'detective',
    isHost: true,
    order: 0,
    balance: 0,
    location: 'Majestic',
  });

  return NextResponse.json({ roomCode, playerId: hostId });
}
