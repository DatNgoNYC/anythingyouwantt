import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { UserInfo } from '../../../types'

export { You }

const You = (): React.JSX.Element => {
  const [isLoading, setisLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const { userId } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    pfp: '',
  })

  useEffect(() => {
    async function loadPage() {
      if (!userId) return
      else {
        setisLoading(true)

        const userData = await fetchUserData(userId)
        if (!userData) {
          setError('Could not get user data.')
        } else {
          setUserInfo(userData)
        }

        setisLoading(false)
      }
    }

    loadPage()
  }, [userId])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{`Error: ${error}`}</div>

  return (
    <div>
      <h1>{userInfo.name}</h1>
      <h2>{userInfo.email}</h2>
      <img src={userInfo.pfp} alt="profile picture" />
      <button onClick={() => sendDeleteRequest(userId as string)}>delete account</button>
    </div>
  )
}

async function fetchUserData(userId: string): Promise<UserInfo | void> {
  const url = '/api/user'
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Id': userId,
    },
  }

  const userInfo = await fetch(url, options)
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error)
      } else {
        return response.json()
      }
    })
    .then((data: { name: string; email: string; pfp: string }) => {
      return data
    })
    .catch((error) => {
      console.error(`Error while trying to hit the /auth endpoint: ${error}.`)
    })

  return userInfo
}

async function sendDeleteRequest(userId: string): Promise<UserInfo | void> {
  const url = '/api/user'
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'User-Id': userId,
    },
  }

  const userInfo = await fetch(url, options)
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error)
      } else {
        return response.json()
      }
    })
    .then((data: { name: string; email: string; pfp: string }) => {
      console.log(`Succesfully deleted user ${data.name}`)
      return data
    })
    .catch((error) => {
      console.error(`Error while trying to hit the /auth endpoint: ${error}.`)
    })

  return userInfo
}
