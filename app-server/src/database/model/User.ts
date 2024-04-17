import { db } from '../db'

export type User = {
  userId: string
  name: string
  email: string
  pfp: string
}

export async function createUserTable(): Promise<void> {
  return await db.query(
    `
    CREATE TABLE IF NOT EXISTS "User" (
      "userId" VARCHAR(255) PRIMARY KEY,
      "name" VARCHAR(255),
      "email" VARCHAR(255),
      "pfp" TEXT
    );
  `
  )
}

export async function getUser(userId: string): Promise<User | null> {
  return await db.oneOrNone(
    `
    SELECT * FROM "User"
    WHERE "userId" = $1;
    `,
    [userId]
  )
}

export async function createUser(userId: string, name: string, email: string, picture: string): Promise<User> {
  const insertQuery = `
  INSERT INTO "User" ("userId", "name", "email", "pfp")
  VALUES ($1, $2, $3, $4)
  RETURNING *;  
`
  const newUser = await db.one(insertQuery, [userId, name, email, picture])

  return newUser
}

export async function deleteUser(userId: string): Promise<User> {
  const deleteQuery = `
  DELETE FROM "User"
  WHERE "userId" = $1
  RETURNING *;  
`
  const deletedUser = await db.oneOrNone(deleteQuery, [userId])

  if (!deletedUser) {
    throw new Error('User not found')
  }

  return deletedUser
}
