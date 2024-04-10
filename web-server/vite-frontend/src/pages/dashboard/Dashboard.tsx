import { ReactNode, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DashboardContext } from '../../context/DashboardContext';
import styles from './Dashboard.module.css';

const Dashboard = (): ReactNode => {
  const { isDashboardActive } = useContext(DashboardContext);

  return (
    <div
      className={`${styles.dashboard} ${
        isDashboardActive ? styles.active : ''
      }`}
    >
      <SignOutButton />
    </div>
  );
};

export { Dashboard };

const SignOutButton = () => {
  const { setUserId } = useContext(AuthContext);
  const { setIsDashboardActive } = useContext(DashboardContext);

  return (
    <div
      onClick={() => {
        setIsDashboardActive(false);
        setUserId(null);
      }}
    >
      Sign Out
    </div>
  );
};
