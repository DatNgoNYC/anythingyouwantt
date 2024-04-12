// [NOTE] The CredentialResponse data type that is given back by Google after user successfully signs in.

import { Dispatch, SetStateAction } from "react";

// https://developers.google.com/identity/gsi/web/reference/js-reference#CredentialResponse
export type CredentialResponse = {
  credential: string;
};

export type PageProps = {
  currentPage: string;
};

export type MenuProps = {
  currentPage: string;
  setCurrentPage: Dispatch<SetStateAction<string>>;
};

export type UserInfo = {
  name: string;
  email: string;
  pfp: string;
};

export type Order = {
  orderId: string;
  title: string;
  orderDate: string;
}