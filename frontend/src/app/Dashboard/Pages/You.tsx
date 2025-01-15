import './You.scss'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCurrentUserContext } from '../../../hooks/CurrentUserContext'
import useIsDashboardActiveContext from '../../../hooks/DashboardActiveContext'

export default function You() {
  const { currentUser, setCurrentUser } = useCurrentUserContext()
  const { setIsDashboardActive } = useIsDashboardActiveContext()
  const isMobile = useIsMobile()

  const handleDelete = async () => {
    if (!currentUser?.userId) {
      console.error('No user ID found, cannot delete user')
      return
    }
    await delUserApiRequest(currentUser.userId).then(() => {
      setCurrentUser(null)
    }, null)

    setIsDashboardActive(false)
  }

  return (
    <div className={`you`}>
      <img src={currentUser ? currentUser.pfp : ''} alt="profile picture" />
      <p>
        <b>Name:</b> {currentUser ? currentUser.name : ''}
      </p>
      <p>
        <b>Email:</b> {currentUser ? currentUser.email : ''}
      </p>
      {isMobile ? (
        <div className="button-container">
          <button
            className={`sign-out`}
            onClick={() => {
              setCurrentUser(null)
              setIsDashboardActive(false)
            }}
          >
            Sign Out
          </button>
          <button
            className="delete-account"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleDelete}
          >
            Delete Account
          </button>
        </div>
      ) : (
        <button
          className="delete-account"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handleDelete}
        >
          Delete Account
        </button>
      )}
    </div>
  )
}

// Helper Functions

const delUserApiRequest = async (userId: string) => {
  try {
    const url = '/api/user'
    const options = {
      method: 'DELETE',
      headers: {
        'Authorization': userId,
        'Content-Type': 'application/json',
      },
    }

    console.log('sending DELETE /api/user request...')
    const res = await fetch(url, options)

    if (!res.ok) {
      console.error('Unexpected error:', res)
      return
    }

    console.log('Successfully deleted user', res)
  } catch (error) {
    console.log('Unexpect error:', error)
  }
}
