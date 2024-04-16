import { OAuthPayload } from '../../controller/services/googleAuth'
import db from '../db'

type User = {
  uniqueId: string
  name: string
  email: string
  pfp: string
}

export async function createUserTable(): Promise<any> {
  return await db.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "uniqueId" VARCHAR(255) PRIMARY KEY,
      "name" VARCHAR(255),
      "email" VARCHAR(255),
      "pfp" TEXT
    );
  `)
}

export async function createUser(userInfo: OAuthPayload): Promise<string> {
  return db.tx(async (t) => {
    const user = await t.oneOrNone(
      `
    SELECT "userId" FROM "User" WHERE "uniqueId" = $1
    `,
      [userInfo.uniqueId]
    )

    if (user) {
      return user.uniqueId
    } else {
      await t.none(
        `
        INSERT INTO "User" ("uniqueId", "name", "email", "pfp")
        VALUES ($1, $2, $3, $4)
      `,
        [userInfo.uniqueId, userInfo.name, userInfo.email, userInfo.picture]
      )

      return userInfo.uniqueId
    }
  })
}
