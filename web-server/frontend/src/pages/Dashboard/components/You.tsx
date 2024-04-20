import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { UserInfo } from '../../../types'

export { You }

const You = (): React.JSX.Element => {
  const { userId } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    pfp: '',
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function loadPage() {
      if (!userId) return

      try {
        setLoading(true)
        const userData = await fetchUserData(userId)
        setUserInfo(userData)
        setLoading(false)
      } catch (error) {
        setError('Error while trying to fetch user info.')
        setLoading(false)
      }
    }

    loadPage()
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{`Error: ${error}`}</div>

  return (
    <div>
      <h1>{userInfo.name}</h1>
      <h2>{userInfo.email}</h2>
      <img src={userInfo.pfp} alt="profile picture" />
    </div>
  )
}

async function fetchUserData(userId: string): Promise<UserInfo> {
  try {
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        userId: userId as string,
      },
    })

    if (!response.ok) {
      console.error(`Failed to get user data for user: ${userId}`)
      throw Error()
    } else {
      const data = await response.json()
      console.log(
        `Successfully retreived user information - name: ${data.name}, ${data.email}, ${data.pfp} `,
      )
      return { name: data.name, email: data.email, pfp: data.pfp }
    }

  } catch (error) {
    console.error(`Could not get user information : ${error}`)
    throw Error()
  }
}
