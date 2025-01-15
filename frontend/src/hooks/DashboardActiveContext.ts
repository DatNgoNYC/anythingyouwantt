import { createContext, useContext } from 'react'

interface IsDashboardActiveContextType {
  isDashboardActive: boolean
  setIsDashboardActive: React.Dispatch<React.SetStateAction<boolean>>
}

export const IsDashboardActiveContext = createContext<IsDashboardActiveContextType| null>(null)

export default function useIsDashboardActiveContext() {
  const dashboardActiveContext = useContext(IsDashboardActiveContext)

  if (!dashboardActiveContext) {
    throw new Error(
      'useCurrentUser has to be used within <CurrentUserContext.Provider>'
    )
  }

  return dashboardActiveContext
}
