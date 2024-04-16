import db from '../db'

export type Thing = {
  id: number
  title: string
  date: Date
  userId: string
}

export async function createThingTable(): Promise<any> {
  return db.query(`
    CREATE TABLE IF NOT EXISTS "Thing" (
      "id" SERIAL PRIMARY KEY
      "title" VARCHAR(255) NOT NULL,
      "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "userId" VARCHAR(255) REFERENCES "User"("uniqueId")
    )
  `)
}

export async function createThing(userId: string, title: string) {
  return db.tx(async (t) => {
    await t.none(
      `
      INSERT INTO "Thing" ("title", "userId")
      VALUES ($1, $2)
      `,
      [title, userId]
    )
  })
}

export async function getAllThings(userId: string) {
  return db.query(
    `
    SELECT "id", "title", "date"
    FROM "Thing"
    WHERE "userId" = $1
    ORDER BY "date" DESC
    `,
    [userId]
  )
}
