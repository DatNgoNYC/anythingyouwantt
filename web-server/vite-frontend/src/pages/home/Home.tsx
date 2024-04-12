// the Login Button and dashboard button will be conditionally rendered depending on whether the user is logged in.

import { useContext } from 'react';

import { Logo } from './components/Logo';
import { Searchbar } from './components/Searchbar';
import { OpenDashboardButton } from './components/ActionButton/OpenDashboardButton';
import { GoogleSignInButton } from './components/ActionButton/GoogleSignInButton';
import { AuthContext } from '../../context/AuthContext';
import styles from './style/Home.module.css'

const Home = () => {
  return (
    <div className={`${styles.home}`}>
      <AuthButtonContainer />
      <Logo />
      <Searchbar />
    </div>
  );
};

const AuthButtonContainer = (): React.JSX.Element => {
  const { userId } = useContext(AuthContext);

  const googleVisible = !userId; 
  const dashboardVisible = !!userId;  

  return (
    <div className={styles.authButtonContainer}>
      <GoogleSignInButton isVisible={googleVisible} />
      <OpenDashboardButton isVisible={dashboardVisible} />
    </div>
  );
};

export default Home;
