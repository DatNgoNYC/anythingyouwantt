import { ReactNode, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { OpenDashboardButton } from './OpenDashboardButton';

export function ActionButtonContainer(): ReactNode {
  // it will either be rendering the googleSignInButton or the ActivateDashboardButton depending on whether the user is signed in or not
  const { userId } = useContext(AuthContext);

  const button: ReactNode = userId ? (
    <OpenDashboardButton />
  ) : (
    <GoogleSignInButton />
  );

  return button;
}

