import { db } from "../db"

export type Order = {
  id: number
  title: string
  date: Date
  userId: string
}

export async function createOrderTable(): Promise<void> {
  return db.query(`
    CREATE TABLE IF NOT EXISTS "Order" (
      "id" SERIAL PRIMARY KEY
      "title" VARCHAR(255) NOT NULL,
      "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "userId" VARCHAR(255) REFERENCES "User"("uniqueId")
    )
  `)
}

export async function createOrder(userId: string, title: string) {
  return db.tx(async (t) => {
    await t.none(
      `
      INSERT INTO "Order" ("title", "userId")
      VALUES ($1, $2)
      `,
      [title, userId]
    )
  })
}

export async function getAllOrders(userId: string) {
  return db.query(
    `
    SELECT "id", "title", "date"
    FROM "Order"
    WHERE "userId" = $1
    ORDER BY "date" DESC
    `,
    [userId]
  )
}
