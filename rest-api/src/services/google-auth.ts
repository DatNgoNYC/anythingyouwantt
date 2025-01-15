/* OAuth-based authentication. */
/* See link for more info https://developers.google.com/identity/gsi/web/guides/verify-google-id-token#node.js */

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

export const verifyGoogleIdToken = async (idToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_OAUTH2_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (payload) {
    const profile = {
      userId: payload.sub,
      name: payload.name ?? '',
      email: payload.email ?? '',
      pfp: payload.picture ?? '',
    };

    return profile;
  } else {
    throw Error('Could not verify google user');
  }
};
