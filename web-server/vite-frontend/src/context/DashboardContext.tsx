import { ReactNode, createContext, useState } from 'react';

type DashboardContextType = {
  isDashboardActive: boolean;
  setIsDashboardActive: React.Dispatch<React.SetStateAction<boolean>>;
};

type DashboardProviderProps = {
  children: ReactNode;
};

const defaultDashboardContextState: DashboardContextType = {
  isDashboardActive: false,
  setIsDashboardActive: () => {},
};
const DashboardContext = createContext<DashboardContextType>(
  defaultDashboardContextState
);

const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [isDashboardActive, setIsDashboardActive] = useState(false);

  return (
    <DashboardContext.Provider value={{ isDashboardActive, setIsDashboardActive }}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
