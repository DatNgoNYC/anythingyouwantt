import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

export type OAuthPayload = {
  name: string,
  email: string,
  uniqueId: string,
  picture: string
}

async function verifyGoogleToken(idToken: string) : Promise<OAuthPayload> {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_OAUTH_CLIENT_ID
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error ('Could not get a payload from google-oauth-library.')
  }

  if (!payload['name'] || !payload['email'] || !payload['sub'] || !payload['picture']) {
    throw new Error('The ID token is missing required fields.');
  }

  return {
    name: payload['name'], 
    email: payload['email'],
    uniqueId: payload['sub'],
    picture: payload['picture'] 
  }
}

export const Services = {
  verifyGoogleToken
};
