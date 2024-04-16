import { Dispatch, SetStateAction, useContext } from 'react';
import { MenuProps } from '../../../types';
import { DashboardContext } from '../../../context/DashboardContext';
import styles from '../style/Dashboard.module.css';
import { AuthContext } from '../../../context/AuthContext';

export { SidePanel };
export type { SidePanelProps };

type SidePanelProps = {
  currentPage: string;
  setCurrentPage: Dispatch<SetStateAction<string>>;
};

const SidePanel = ({
  currentPage,
  setCurrentPage,
}: SidePanelProps): React.JSX.Element => {
  return (
    <div>
      <BackButton />
      <Menu currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <SignOutButton />
    </div>
  );
};

const BackButton = (): React.JSX.Element => {
  const { setIsDashboardActive } = useContext(DashboardContext);
  return (
    <div
      className={`${styles.backButton}`}
      onClick={() => setIsDashboardActive(false)}
    >
      Back
    </div>
  );
};

const Menu = ({
  currentPage,
  setCurrentPage,
}: MenuProps): React.JSX.Element => {
  return (
    <div id="Menu">
      <div
        className={currentPage === 'you' ? styles.highlighted : ''}
        onClick={() => setCurrentPage('you')}
      >
        You
      </div>
      <div
        className={currentPage === 'orders' ? styles.highlighted : ''}
        onClick={() => setCurrentPage('orders')}
      >
        What You Wanted
      </div>
    </div>
  );
};

const SignOutButton = (): React.JSX.Element => {
  const { setUserId } = useContext(AuthContext);
  const { setIsDashboardActive } = useContext(DashboardContext);

  return (
    <div
      className={`${styles.signOutButton}`}
      onClick={() => {
        setUserId(null);
        setIsDashboardActive(false);
      }}
    >
      Sign Out
    </div>
  );
};
