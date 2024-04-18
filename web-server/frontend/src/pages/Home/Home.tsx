// the Login Button and dashboard button will be conditionally rendered depending on whether the user is logged in.

import { useContext } from 'react'

import { Logo } from './components/Logo'
import { Searchbar } from './components/Searchbar'
import { AuthContext } from '../../context/AuthContext'
import { GoogleSignInButton } from './components/AuthButtons/GoogleSignInButton'
import { OpenDashboardButton } from './components/AuthButtons/OpenDashboardButton'
import styles from './Home.module.scss'

const Home: React.FC = () => {
  return (
    <div className={`${styles.home}`}>
      <AuthButtonContainer />
      <Logo />
      <Searchbar />
    </div>
  )
}

const AuthButtonContainer = () => {
  const { userId } = useContext(AuthContext)

  const googleVisible = !userId
  const dashboardVisible = !!userId

  return (
    <div className={styles.authButtonContainer}>
      <GoogleSignInButton isVisible={googleVisible} />
      <OpenDashboardButton isVisible={dashboardVisible} />
    </div>
  )
}

export default Home
