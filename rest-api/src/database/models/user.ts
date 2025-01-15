import db from '../utils/connect.js';

export interface User {
  userId: string;
  name: string;
  email: string;
  pfp: string;
}

const createUserTable = async (): Promise<void> => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" VARCHAR(255) PRIMARY KEY,
      "name" VARCHAR(255),
      "email" VARCHAR(255),
      "pfp" TEXT 
    );
  `);
};

const createUser = async (user: User): Promise<User> => {
  const { userId, name, email, pfp } = user;

  return await db.one(
    `
      INSERT INTO "User" ("id", "name", "email", "pfp")
      VALUES ($1, $2, $3, $4)
      RETURNING "id" AS "userId", "name", "email", "pfp";  
    `,
    [userId, name, email, pfp]
  );
};

const getUser = async (userId: string): Promise<User | null> => {
  return await db.oneOrNone(
    `
      SELECT "id" AS "userId", "name", "email", "pfp"
      FROM "User"
      WHERE "id" = $1;
    `,
    [userId]
  );
};

const deleteUser = async (userId: string): Promise<void> => {
  await db.one(
    `
      DELETE FROM "User"
      WHERE "id" = $1
      RETURNING *;
    `,
    [userId]
  );
};

// Define UserModel after all functions
export const UserModel = {
  createUserTable,
  createUser,
  getUser,
  deleteUser,
};
