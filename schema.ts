import { pgTable, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const rooms = pgTable('rooms', {
  id: text('id').primaryKey(), // The room code (e.g., BLR-7A42)
  status: text('status').notNull().default('waiting'), // 'waiting', 'playing', 'finished'
  currentRound: integer('current_round').notNull().default(1),
  maxRounds: integer('max_rounds').notNull().default(24),
  currentTurnPlayerId: text('current_turn_player_id'), // ID of the detective or 'mr_x'
  phase: text('phase').notNull().default('question'), // 'question', 'movement', 'reveal'
  gameData: jsonb('game_data').$type<{
    mrXLocation: string;
    mrXLastRevealRound: number;
    mrXLastRevealLocation: string;
    winningTeam?: 'detectives' | 'mr_x';
  }>(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const players = pgTable('players', {
  id: text('id').primaryKey(),
  roomId: text('room_id').references(() => rooms.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  role: text('role').notNull(), // 'detective' | 'mr_x'
  balance: integer('balance').notNull().default(0),
  location: text('location').notNull().default('Majestic'),
  isHost: boolean('is_host').default(false),
  order: integer('order').notNull().default(0), // For sequential turns
  isConnected: boolean('is_connected').default(true),
});

export const gameLogs = pgTable('game_logs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  roomId: text('room_id').references(() => rooms.id, { onDelete: 'cascade' }),
  round: integer('round').notNull(),
  playerId: text('player_id').notNull(),
  playerName: text('player_name').notNull(),
  role: text('role').notNull(),
  fromLocation: text('from_location').notNull(),
  toLocation: text('to_location').notNull(),
  transport: text('transport').notNull(), // 'taxi', 'bus', 'metro'
  timestamp: timestamp('timestamp').defaultNow(),
});

export const questions = pgTable('questions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  options: jsonb('options').$type<string[]>(),
  category: text('category'),
});
