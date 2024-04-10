import { ReactNode, useContext } from 'react';
import { DashboardContext } from '../../../context/DashboardContext';
import { AuthContext } from '../../../context/AuthContext';

const OpenDashboardButton = (): ReactNode => {
  const { setIsDashboardActive } = useContext(DashboardContext);
  const { userId } = useContext(AuthContext)

  return (
    <div
      onClick={() => {
        setIsDashboardActive(true);
      }}

      className={ userId ? '' : 'hidden'}
    >
      Open Dashboard
    </div>
  );
};

export { OpenDashboardButton };
