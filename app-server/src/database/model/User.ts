import { OAuthPayload } from '../../controller/services/googleAuth';
import db from '../db';

export async function createUserTable(): Promise<any> {
  return await db.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "uniqueId" PRIMARY KEY,
      "name" VARCHAR(100),
      "email" VARCHAR(100),
      "pfp" TEXT
    );
  `);
}

export async function createUser(userInfo: OAuthPayload): Promise<string> {
  return db.tx(async (t) => {
    const user = await t.oneOrNone(
      `
    SELECT "userId" FROM "User" WHERE "uniqueId" = $1
    `,
      [userInfo.uniqueId]
    );

    if (user) {
      return user.uniqueId;
    } else {
      await t.none(
        `
        INSERT INTO "User" ("uniqueId", "name", "email", "pfp")
        VALUES ($1, $2, $3, $4)
      `,
        [userInfo.uniqueId, userInfo.name, userInfo.email, userInfo.picture]
      );

      return userInfo.uniqueId
    }
  });
}
