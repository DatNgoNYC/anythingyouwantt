import db from '../utils/connect.js';

export interface Order {
  orderId: string;
  title: string;
  createdAt: string;
  deliveredAt?: string;
}

// Function to create the Orders table
const createOrderTable = async (): Promise<void> => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS "Orders" (
      "id" VARCHAR(255) PRIMARY KEY,
      "title" VARCHAR(255) NOT NULL,
      "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "delivered_at" TIMESTAMP, 
      "user_id" VARCHAR(255) NOT NULL, 
      CONSTRAINT fk_user FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE
    );
  `);
};

const createOrder = async (userId: string, title: string): Promise<Order> => {
  return await db.one(
    `
    INSERT INTO "Orders" ("id", "title", "user_id", "created_at", "delivered_at")
    VALUES (gen_random_uuid(), $1, $2, DEFAULT, NULL)
    RETURNING 
      "id" AS "orderId", 
      "title", 
      "created_at" AS "createdAt", 
      "delivered_at" AS "deliveredAt";
    `,
    [title, userId]
  );
};

const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  return await db.manyOrNone(
    `
    SELECT 
      "id" AS "orderId", 
      "title", 
      "created_at" AS "createdAt", 
      "delivered_at" AS "deliveredAt"
    FROM "Orders"
    WHERE "user_id" = $1
    ORDER BY "created_at" DESC;
    `,
    [userId]
  );
};

const deleteByOrderId = async (userId: string, orderId: string): Promise<Order | null> => {
  return await db.oneOrNone(
    `
    DELETE FROM "Orders"
    WHERE "id" = $1 AND "user_id" = $2
    RETURNING 
      "id" AS "orderId", 
      "title", 
      "created_at" AS "createdAt", 
      "delivered_at" AS "deliveredAt";
    `,
    [orderId, userId]
  );
};

const updateDeliveryStatus = async (orderId: string, deliveredAt: string): Promise<Order | null> => {
  return db.oneOrNone(
    `
    UPDATE "Orders"
    SET "delivered_at" = $2
    WHERE "id" = $1`,
    [orderId, deliveredAt]
  );
};

export const OrderModel = {
  createOrderTable,
  createOrder,
  getOrdersByUserId,
  deleteByOrderId,
  updateDeliveryStatus,
};
