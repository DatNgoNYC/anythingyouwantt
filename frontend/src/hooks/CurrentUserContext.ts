import { createContext, useContext } from 'react'
import { User } from '../types/types'

interface CurrentUserContextType {
  currentUser: User | null
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const CurrentUserContext = createContext<CurrentUserContextType | null>(
  null
)

export const useCurrentUserContext = () => {
  const currentUserContext = useContext(CurrentUserContext)

  if (!currentUserContext) {
    throw new Error(
      'useCurrentUser has to be used within <CurrentUserContext.Provider>'
    )
  }

  return currentUserContext
}
