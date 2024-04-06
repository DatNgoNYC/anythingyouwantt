import verifyToken, { OAuthPayload } from "./services/googleAuth";

export async function signInOrCreateUser(
  idToken: string
): Promise<{ uniqueId: string }> {
  // we will use ./services services to sign in the user
  // 1. googleAuth.ts will be needed to process the idToken we give it. It will give use back the 'payload'
  //      we will need to define our own return type which will just be "name, email, sub, pfp"
  // 'payload' is returned.
  const userInfo : OAuthPayload = await verifyToken(idToken);

  // 2. we want to insert userInfo intooooooo the Account Table in the database. 
  
  

  // 3. return the uniqueId promise
  // DONE FOR anythingyouwantt.com/auth w/ idToken in Body
  // response = {unqiueId: string}
  return "hi"
}
