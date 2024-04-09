import { ReactNode, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

const OpenDashboardButton = (): ReactNode => {
  const { userId, setUserId } = useContext(AuthContext);
  
  return <div onClick={() => {
    console.log(userId)
    setUserId(null)
  }}>signOut</div>;
};

export { OpenDashboardButton };
