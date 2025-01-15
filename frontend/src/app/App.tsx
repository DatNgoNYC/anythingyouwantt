import { useState } from 'react'
import '../styles/global.css'
import './App.scss'
import Dashboard from './Dashboard/Dashboard'
import Home from './Home/Home'
import { CurrentUserContext } from '../hooks/CurrentUserContext'
import { IsDashboardActiveContext } from '../hooks/DashboardActiveContext'
import { User } from '../types/types'

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isDashboardActive, setIsDashboardActive] = useState(false)

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <IsDashboardActiveContext.Provider
        value={{ isDashboardActive, setIsDashboardActive }}
      >
        <div className="app">
          <Home />
          <Dashboard />
        </div>
      </IsDashboardActiveContext.Provider>
    </CurrentUserContext.Provider>
  )
}

