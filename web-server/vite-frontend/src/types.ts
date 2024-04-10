// [NOTE] The CredentialResponse data type that is given back by Google after user successfully signs in.
// https://developers.google.com/identity/gsi/web/reference/js-reference#CredentialResponse
export type CredentialResponse = {
  credential: string;
};
