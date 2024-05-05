import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { UserInfo } from '../../../types'
import styles from '../Dashboard.module.scss'
export { You }

const You = (): React.JSX.Element => {
  const [isLoading, setisLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const { userId } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState<UserInfo>(
    {
      name: '',
      email: '',
      pfp: '',
    },
    //   {
    //   name: 'Dat Ngo',
    //   email: 'datngonyc@gmail.com',
    //   pfp: 'https://lh3.googleusercontent.com/a/ACg8ocL7P8CGwpHjNEZzmEAqjUqM5Pxw17T7ruEKg0Jm1HsXuZZxrTg=s288-c-no',
    // }
  )

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
    <div className={`${styles.You}`}>
      <img src={userInfo.pfp} alt="profile picture" />
      <p>
        <b>Name:</b> {userInfo.name}
      </p>
      <p>
        <b>Email:</b> {userInfo.email}
      </p>
      <button onClick={() => sendDeleteRequest(userId as string)}>
        Delete Account
      </button>
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
