import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

import { questions } from '@/db/schema';
import { seedQuestions } from '@/db/seed';

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    const count = await db.select().from(questions);
    if (count.length === 0) {
      await seedQuestions();
    }
    return Response.json({ ok: true, questionsCount: count.length });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false }, { status: 500 });
  }
}
