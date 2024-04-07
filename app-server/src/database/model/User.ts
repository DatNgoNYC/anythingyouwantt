import { OAuthPayload } from "../../controller/services/googleAuth";
import db from "../db";

export async function createUserTable() : Promise<any> {
  return await db.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "userId" PRIMARY KEY,
      "name" VARCHAR(100),
      "email" VARCHAR(100),
      "pfp" TEXT
    );
  `);
}

export async function createUser(userInfo: OAuthPayload) : Promise<string> {
  return db.tx
}

