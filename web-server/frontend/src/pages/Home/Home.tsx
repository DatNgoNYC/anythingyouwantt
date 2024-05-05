import { useContext, useState } from 'react'
import { Searchbar } from './components/Searchbar'
import { AuthContext } from '../../context/AuthContext'
import { GoogleSignInButton } from './components/AuthButtons/GoogleSignInButton'
import { OpenDashboardButton } from './components/AuthButtons/OpenDashboardButton'
import styles from './Home.module.scss'

const Home: React.FC = () => {
  const [highlightLogin, setHighlightLogin] = useState(false)

  return (
    <div className={`${styles.Home}`}>
      <AuthButtonContainer highlightLogin={highlightLogin} />
      <Logo />
      <Searchbar
        triggerLoginIndicator={() => {
          setHighlightLogin(true)
          console.log('setting highlight to true')
          setTimeout(() => {
            setHighlightLogin(false)
            console.log('setting highlight to false')
          }, 2000)
        }}
      />
    </div>
  )
}

type AuthButtonContainerProp = {
  highlightLogin: boolean
}

const AuthButtonContainer = ({ highlightLogin }: AuthButtonContainerProp) => {
  const { userId } = useContext(AuthContext)

  const googleVisible = !userId
  const dashboardVisible = !!userId

  return (
    <div
      className={`${styles.AuthButtonContainer} ${highlightLogin ? 'shimmer-effect' : ''}`}
    >
      <GoogleSignInButton isVisible={googleVisible} />
      <OpenDashboardButton isVisible={dashboardVisible} />
    </div>
  )
}

const Logo = () => {
  return <div className={styles.Logo}>Anything You Want</div>
}

export default Home
