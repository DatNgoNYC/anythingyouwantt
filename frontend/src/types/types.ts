export interface User {
  userId: string
  name: string
  email: string
  pfp: string
}

export interface Order {
  orderId: string
  title: string
  createdAt: string
  deliveredAt: string
}

export interface ErrorResponse {
  error: string;
}

// https://developers.google.com/identity/gsi/web/reference/js-reference#CredentialResponse
/** The response from the Google Auth Api containing the idToken */
export interface CredentialResponse {
  credential: string
}