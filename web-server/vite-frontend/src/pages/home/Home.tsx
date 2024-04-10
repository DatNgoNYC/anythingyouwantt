// the Login Button and dashboard button will be conditionally rendered depending on whether the user is logged in.

import { ReactNode } from 'react';

import { Logo } from './Logo';
import { Searchbar } from './Searchbar';
import { OpenDashboardButton } from './ActionButton/OpenDashboardButton';
import { GoogleSignInButton } from './ActionButton/GoogleSignInButton';

const Home = () => {
  const AuthButtonContainer: ReactNode = (
    <div>
      <GoogleSignInButton />
      <OpenDashboardButton />
    </div>
  );

  return (
    <div>
      {AuthButtonContainer}
      <Logo />
      <Searchbar />
    </div>
  );
};

export default Home;
