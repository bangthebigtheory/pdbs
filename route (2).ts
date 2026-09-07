import { NextResponse } from 'next/server';
import { db } from '@/db';
import { players, rooms } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = await params;
  const { name, role, names } = await req.json(); // names is an array for Hub

  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
  });

  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

  const existingPlayers = await db.select().from(players).where(eq(players.roomId, roomId));
  
  if (role === 'mr_x') {
    if (existingPlayers.some(p => p.role === 'mr_x')) {
        return NextResponse.json({ error: 'Mr. X already joined' }, { status: 400 });
    }
    const playerId = nanoid();
    await db.insert(players).values({
      id: playerId,
      roomId,
      name,
      role: 'mr_x',
      order: 0,
      location: 'Majestic',
    });
    return NextResponse.json({ playerId });
  } else {
    // Detective(s)
    const playerIds: string[] = [];
    const detectiveNames = names || [name];
    
    for (const dName of detectiveNames) {
        const pId = nanoid();
        await db.insert(players).values({
            id: pId,
            roomId,
            name: dName,
            role: 'detective',
            order: existingPlayers.length + playerIds.length + 1, // Mr X is 0
            location: 'Majestic',
        });
        playerIds.push(pId);
    }
    return NextResponse.json({ playerIds });
  }
}
