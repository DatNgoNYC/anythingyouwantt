import { OAuthPayload } from '../../controller/services/googleAuth'
import db from '../db'

/**
 * Creates a table for users in the PostgreSQL database if it doesn't already exist.
 * This function ensures that the 'User' table is available for storing user data.
 *
 * @returns {Promise<any>} A promise that resolves when the table is successfully created or already exists.
 *
 * @remarks
 * The table is defined with the following columns:
 * - "uniqueId": The primary key for the user, expected to be unique.
 * - "name": A VARCHAR(100) field to store the user's name.
 * - "email": A VARCHAR(100) field to store the user's email address.
 * - "pfp": A TEXT field to store the URL to the user's profile picture.
 */
export async function createUserTable(): Promise<any> {
  return await db
    .query(
      `
    CREATE TABLE IF NOT EXISTS "User" (
      "uniqueId" PRIMARY KEY,
      "name" VARCHAR(100),
      "email" VARCHAR(100),
      "pfp" TEXT
    );
  `,
    )
    .catch((error) => {
      console.log(
        `An attempt was made to create the user table in the pg database but the operation failed. This is the error: ${error.message}`,
      )

      throw new Error('Failed to create or find a user in the database')
    })
}

/**
 * Creates a new user in the PostgreSQL database or returns the uniqueId if the user already exists.
 * This function first checks if a user with the provided uniqueId exists in the "User" table.
 * If the user exists, their uniqueId is returned. If not, a new record is inserted into the "User" table.
 *
 * @param {OAuthPayload} userInfo - An object containing the user's information. This should match the OAuthPayload interface.
 * @returns {Promise<string>} A promise that resolves with the uniqueId of the user.
 *
 * @throws {Error} Throws an error if the insertion fails.
 *
 * @example
 * // Example of creating a new user
 * const userInfo = {
 *   uniqueId: '12345',
 *   name: 'Jane Doe',
 *   email: 'jane@example.com',
 *   picture: 'http://example.com/pic.jpg'
 * };
 *
 * createUser(userInfo).then(uniqueId => {
 *   console.log(`User created with uniqueId: ${uniqueId}`);
 * }).catch(error => {
 *   console.error('Failed to create user:', error);
 * });
 *
 * @remarks
 * This function uses a transaction to ensure that the operation is atomic.
 * The function handles exceptions by logging the error and rethrowing a generic error message.
 */

export async function createUser(userInfo: OAuthPayload): Promise<string> {
  return db
    .tx(async (t) => {
      const user = await t.oneOrNone(
        // check if the user exists
        `
    SELECT "userId" FROM "User" WHERE "uniqueId" = $1
    `,
        [userInfo.uniqueId],
      )

      if (user) {
        return user.uniqueId // return the uniqueId of the user if they were found.
      } else {
        // if the user doesn't exist, create one in the database.
        return await t
          .one(
            `INSERT INTO "User" ("uniqueId", "name", "email", "pfp") 
          VALUES ($1, $2, $3, $4) 
          RETURNING "uniqueId"`,
            [
              userInfo.uniqueId,
              userInfo.name,
              userInfo.email,
              userInfo.picture,
            ],
          )
          .then((result) => result.uniqueId)
      }
    })
    .catch((error) => {
      console.log(
        `An attempt was made to insert the user into the pg database but the operation failed. This is the error: ${error.message}`,
      )

      throw new Error('Failed to create or find a user in the database')
    })
}

export async function deleteUser(uniqueId: string): Promise<string> {
  return db
    .tx(async (t) => {
      const user = await t.oneOrNone(
        `SELECT "uniqueId" FROM "User" WHERE "uniqueId" = $1`,
        [uniqueId],
      )

      if (!user) {
        throw new Error(`No user found with uniqueId ${uniqueId}`)
      } else {
        await t
          .one(
            `DELETE FROM "User" WHERE "uniqueId" = $1 
        RETURNING "uniqueId"`,
            [uniqueId],
          )
          .then((result) => result.uniqueId)

        return `User with uniqueId ${uniqueId} has been successfully deleted.`
      }
    })
    .catch((error) => {
      console.log(
        `Failed to delete user with uniqueId ${uniqueId}. Error: ${error}`,
      )
      throw new Error('Failed to delete the user from the database')
    })
}
