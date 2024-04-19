import { useContext } from 'react'
import { DashboardContext } from '../../../../context/DashboardContext'
import styles from '../../Home.module.scss'

type OpenDashboardButtonProp = {
  isVisible: boolean
}

const OpenDashboardButton: React.FC<OpenDashboardButtonProp> = ({
  isVisible,
}) => {
  const { setIsDashboardActive } = useContext(DashboardContext)

  return (
    <button
      onClick={() => {
        setIsDashboardActive(true)
      }}
      className={`${styles.OpenDashboardButton} ${isVisible ? '' : styles.hidden}`}
    >
      Open Dashboard
    </button>
  )
}

export { OpenDashboardButton }
