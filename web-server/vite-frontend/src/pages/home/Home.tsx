// the Login Button and dashboard button will be conditionally rendered depending on whether the user is logged in.

import { ReactNode, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ActionButtonContainer } from './ActionButton/ActionButtons';

function Home() {
  return (
    <div>
      <ActionButtonContainer />
      <Logo />
      <Searchbar />
    </div>
  );
}

export default Home;

function Logo(): ReactNode {
  return <div></div>;
}

function Searchbar(): ReactNode {
  return <div></div>;
}

