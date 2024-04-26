import { db } from '../db'

export type Order = {
  id: number
  title: string
  date: Date
  userId: string
}

export async function createOrderTable(): Promise<void> {
  return db.query(`
    CREATE TABLE IF NOT EXISTS "Order" (
      "id" SERIAL PRIMARY KEY,
      "title" VARCHAR(255) NOT NULL,
      "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "userId" VARCHAR(255) REFERENCES "User"("userId")
      ON DELETE CASCADE
    )
  `)
}

export async function createOrder(userId: string, title: string): Promise<{ id: number; title: string; date: string }> {
  const order = db.one(
    `
  INSERT INTO "Order" ("userId", "title")
  VALUES ($1, $2)
  RETURNING *;  
  `,
    [userId, title]
  )

  return order
}

export async function getAllOrders(userId: string): Promise<Array<{ id: number; title: string; date: string }>> {
  const orders = db.manyOrNone(
    `
    SELECT "id", "title", "date"
    FROM "Order"
    WHERE "userId" = $1
    ORDER BY "date" DESC
    `,
    [userId]
  )

  return orders
}
