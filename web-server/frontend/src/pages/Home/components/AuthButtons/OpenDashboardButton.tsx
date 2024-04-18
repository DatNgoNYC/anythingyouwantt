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
    <div
      onClick={() => {
        setIsDashboardActive(true)
      }}
      className={`${styles.openDashboardButton} ${isVisible ? '' : styles.hidden}`}
    >
      Open Dashboard
    </div>
  )
}

export { OpenDashboardButton }
