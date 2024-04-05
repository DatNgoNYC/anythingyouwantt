import { createContext, useState } from 'react';

type DashboardContextType = {
  isDashboardActive: boolean;
  setIsDashboardActive: React.Dispatch<React.SetStateAction<boolean>>;
};
const defaultDashboardContextState = {
  isDashboardActive: false,
  setIsDashboardActive: () => {},
};
export const DashboardContext = createContext<DashboardContextType>(
  defaultDashboardContextState
);

type AuthContextType = {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
};
const defaultAuthContextState = { userId: null, setUserId: () => {} };
export const AuthContext = createContext<AuthContextType>(
  defaultAuthContextState
);

function App() {
  const [isDashboardActive, setIsDashboardActive] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('uniqueId'));

  return (
    <DashboardContext.Provider
      value={{ isDashboardActive, setIsDashboardActive }}
    >
      <AuthContext.Provider
        value={{ userId, setUserId }}
      ></AuthContext.Provider>
    </DashboardContext.Provider>
  );
}

export default App;
