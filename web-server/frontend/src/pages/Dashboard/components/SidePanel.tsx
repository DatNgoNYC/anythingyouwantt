import { Dispatch, SetStateAction, useContext } from 'react'
import { MenuProps } from '../../../types'
import { DashboardContext } from '../../../context/DashboardContext'
import styles from '../Dashboard.module.scss'
import { AuthContext } from '../../../context/AuthContext'

export { SidePanel }
export type { SidePanelProps }

type SidePanelProps = {
  currentPage: string
  setCurrentPage: Dispatch<SetStateAction<string>>
}

const SidePanel = ({
  currentPage,
  setCurrentPage,
}: SidePanelProps): React.JSX.Element => {
  return (
    <div className={`${styles.SidePanel}`}>
      <BackButton />
      <Menu currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <SignOutButton />
    </div>
  )
}

const BackButton = (): React.JSX.Element => {
  const { setIsDashboardActive } = useContext(DashboardContext)
  return (
    <button
      className={`${styles.BackButton}`}
      onClick={() => setIsDashboardActive(false)}
    >
      <span className={`${styles.Icon}`}>←</span>{' '}
      <span className={`${styles.Text}`}>back</span>
    </button>
  )
}

const Menu = ({
  currentPage,
  setCurrentPage,
}: MenuProps): React.JSX.Element => {
  return (
    <div className={styles.Menu}>
      <li
        className={`${currentPage === 'you' ? styles.highlighted : ''}`}
        onClick={() => setCurrentPage('you')}
      >
        You
      </li>
      <li
        className={currentPage === 'orders' ? styles.highlighted : ''}
        onClick={() => setCurrentPage('orders')}
      >
        What You Wanted
      </li>
    </div>
  )
}

const SignOutButton = (): React.JSX.Element => {
  const { setUserId } = useContext(AuthContext)
  const { setIsDashboardActive } = useContext(DashboardContext)

  return (
    <button
      className={`${styles.SignOutButton}`}
      onClick={() => {
        setUserId(null)
        setIsDashboardActive(false)
      }}
    >
      Sign Out
    </button>
  )
}
