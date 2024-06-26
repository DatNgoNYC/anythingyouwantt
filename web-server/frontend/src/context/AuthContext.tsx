import { ReactNode, createContext, useState } from 'react';

type AuthContextType = {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
};

type AuthProviderProps = {
  children: ReactNode;
};

const defaultAuthContextState: AuthContextType = {
  userId: null,
  setUserId: () => {},
};
export const AuthContext = createContext<AuthContextType>(defaultAuthContextState);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState(localStorage.getItem('uniqueId'));

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
