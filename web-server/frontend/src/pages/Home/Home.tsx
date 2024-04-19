import { useContext } from 'react'
import { Searchbar } from './components/Searchbar'
import { AuthContext } from '../../context/AuthContext'
import { GoogleSignInButton } from './components/AuthButtons/GoogleSignInButton'
import { OpenDashboardButton } from './components/AuthButtons/OpenDashboardButton'
import styles from './Home.module.scss'

const Home: React.FC = () => {
  return (
    <div className={`${styles.Home}`}>
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
    <div className={styles.AuthButtonContainer}>
      <GoogleSignInButton isVisible={googleVisible} />
      <OpenDashboardButton isVisible={dashboardVisible} />
    </div>
  )
}

const Logo = () => {
  return <div className={styles.Logo}>Logo</div>
}

export default Home
