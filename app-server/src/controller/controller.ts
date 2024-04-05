export function signInOrCreateUser(req: Request, res: Response) {
  // we will use ./services services to sign in the user

  // 1. googleAuth.ts will be needed to process the idToken we give it. It will give use back the 'payload'
  //      we will need to define our own return type which will just be "name, email, sub, pfp"
  // 
  // 2. if and only if that is successful, we will then attempt another async request... this time to our database.
  //    we want to create a record IF it exists. otherwise it's idompodent so we don't add a duplicate. EITHER WAY, a successful response will return the uniqueId from the database of the user.

  // DONE FOR anythingyouwantt.com/auth w/ idToken in Body
  // response = {unqiueId: string}

}