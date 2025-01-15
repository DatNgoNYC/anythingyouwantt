import { useEffect, useRef, useState } from 'react'
import useIsDashboardActiveContext from '../../hooks/DashboardActiveContext'
import './Dashboard.scss'
import { useCurrentUserContext } from '../../hooks/CurrentUserContext'
import You from './Pages/You'
import Orders from './Pages/Orders'
import Etcetera from './Pages/Etcetera'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function Dashboard() {
  const { isDashboardActive, setIsDashboardActive } = useIsDashboardActiveContext()
  const { setCurrentUser } = useCurrentUserContext()
  type Page = 'you' | 'orders' | 'etc'
  const [currentPage, setCurrentPage] = useState<Page>('you')
  const isMobile = useIsMobile()
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null) // Ref to the dropdown container

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        event.target !== document.querySelector('.title') // Avoid closing if the title is clicked
      ) {
        setIsMobileMenuActive(false) // Close the dropdown
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <div className={`dashboard ${isDashboardActive ? 'active' : ''}`}>
      {isMobile ? (
        <div className="mobile">
          <div className="top-panel">
            <button
              className="back"
              onClick={() => {
                setIsDashboardActive(false)
              }}
            >
              <span className={`icon`}>←</span> <span className={`text`}>back</span>
            </button>
            <div className="menu">
              <h1
                className="title"
                onClick={() => {
                  setIsMobileMenuActive(!isMobileMenuActive)
                }}
              >
                {currentPage === 'orders'
                  ? 'What You Wanted'
                  : currentPage === 'you'
                    ? 'You'
                    : 'Etecetera'}
                <span className="icon">&equiv;</span>
              </h1>

              <div ref={dropdownRef} className={`dropdown ${isMobileMenuActive ? 'active' : ''} `}>
                <li
                  onClick={() => {
                    setCurrentPage('you')
                    setIsMobileMenuActive(false)
                  }}
                >
                  You
                </li>
                <li
                  onClick={() => {
                    setCurrentPage('orders')
                    setIsMobileMenuActive(false)
                  }}
                >
                  What You Wanted
                </li>
                <li
                  onClick={() => {
                    setCurrentPage('etc')
                    setIsMobileMenuActive(false)
                  }}
                >
                  Etcetera
                </li>
              </div>
            </div>
          </div>
          <div className="page-container">
            {currentPage === 'you' && <You />}
            {currentPage === 'orders' && <Orders />}
            {currentPage === 'etc' && <Etcetera />}
          </div>
        </div>
      ) : (
        <div className="desktop">
          <div className="side-panel">
            <button
              className="back"
              onClick={() => {
                setIsDashboardActive(false)
              }}
            >
              <span className={`icon`}>←</span> <span className={`text`}>back</span>
            </button>
            <div className="menu">
              <li
                className={currentPage === 'you' ? 'highlighted' : ''}
                onMouseDown={() => {
                  setCurrentPage('you')
                }}
              >
                You
              </li>
              <li
                className={currentPage === 'orders' ? 'highlighted' : ''}
                onMouseDown={() => {
                  setCurrentPage('orders')
                }}
              >
                What You Wanted
              </li>
              <li
                className={currentPage === 'etc' ? 'highlighted' : ''}
                onMouseDown={() => {
                  setCurrentPage('etc')
                }}
              >
                Etcetera
              </li>
            </div>
            <button
              className={`sign-out`}
              onClick={() => {
                setCurrentUser(null)
                setIsDashboardActive(false)
              }}
            >
              Sign Out
            </button>
          </div>
          <div className="page-container">
            {currentPage === 'you' && <You />}
            {currentPage === 'orders' && <Orders />}
            {currentPage === 'etc' && <Etcetera />}
          </div>
        </div>
      )}
    </div>
  )
}
