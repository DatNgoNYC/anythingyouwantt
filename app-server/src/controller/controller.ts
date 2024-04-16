import { Thing, getAllThings } from "../database/model/Thing";
import { createUser } from "../database/model/User";
import verifyToken, { OAuthPayload } from "./services/googleAuth";

export async function signInOrCreateUser(
  idToken: string
): Promise<string> {
  const userInfo : OAuthPayload = await verifyToken(idToken);
  const userId = await createUser(userInfo)
  
  return userId
}

export async function getThingsByUserId(userId: string): Promise<Thing[]> {
  return getAllThings(userId)
}

export async function createThing(userId: string): Promise<Thing> {
  return createThing(userId)
}