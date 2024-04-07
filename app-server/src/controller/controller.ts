import { createUser } from "../database/model/User";
import verifyToken, { OAuthPayload } from "./services/googleAuth";

export async function signInOrCreateUser(
  idToken: string
): Promise<{ uniqueId: string }> {
  const userInfo : OAuthPayload = await verifyToken(idToken);
  const userId = await createUser(userInfo)
  
  return userId
}