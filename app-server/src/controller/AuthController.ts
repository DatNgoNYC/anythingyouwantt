import { Request, Response } from 'express'
import { OAuthPayload, Services } from './services/googleAuth'
import { Database } from '../database/db'

// Define the shape of the request body specifically for authentication
interface AuthRequestBody {
  idToken: string
}

// Extend the Request type with the specific body type for authentication
type AuthPostRequest = Request<Record<string, never>, Record<string, never>, AuthRequestBody>

// Function to authenticate a user
async function authenticateUser(req: AuthPostRequest, res: Response): Promise<Response> {
  console.log('Received a POST auth request.')

  const { idToken } = req.body
  if (!idToken) {
    return res.status(400).json('Authentication requires an idToken!')
  }

  try {
    const oauthPayload: OAuthPayload = await Services.verifyGoogleToken(idToken)

    let user = await Database.getUser(oauthPayload.uniqueId)
    if (!user) {
      user = await Database.createUser(
        oauthPayload.uniqueId,
        oauthPayload.name,
        oauthPayload.email,
        oauthPayload.picture
      )
    }

    if (user) {
      const { userId } = user
      return res.status(200).json({ userId })
    } else {
      return res.status(500).json('We could not register the user.')
    }
  } catch {
    return res.status(500).json('A network error on our end!')
  }
}

export const AuthController = { authenticateUser }
export type { AuthPostRequest }
