import { ReactNode, useContext } from 'react';
import { DashboardContext } from '../../../../context/DashboardContext';
import styles from '../../style/Home.module.css'

type OpenDashboardButtonProps = {
  isVisible: boolean;
};

const OpenDashboardButton = ({
  isVisible,
}: OpenDashboardButtonProps): ReactNode => {
  const { setIsDashboardActive } = useContext(DashboardContext);

  return (
    <div
      onClick={() => {
        setIsDashboardActive(true);
      }}
      className={`${styles.openDashboardButton} ${isVisible ? '' : styles.hidden}`}
    >
      Open Dashboard
    </div>
  );
};

export { OpenDashboardButton };
