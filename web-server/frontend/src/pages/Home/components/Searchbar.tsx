import { useContext, useState } from 'react'
import styles from '../Home.module.scss'
import { AuthContext } from '../../../context/AuthContext'
import { Order } from '../../../types'

type SearchBarProps = {
  triggerLoginIndicator: () => void
}

export const Searchbar = ({ triggerLoginIndicator }: SearchBarProps) => {
  const { userId } = useContext(AuthContext)
  const [title, setTitle] = useState('')
  const [isProcessingRequest, setIsProcessingRequest] = useState(false)

  async function sendRequest() {
    setIsProcessingRequest(true)
    try {
      const url = '/api/user/orders'
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': userId as string,
        },
        body: JSON.stringify({
          title: title,
        }),
      }

      const order = await fetch(url, options)
        .then(async (response) => {
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error)
          } else {
            return response.json()
          }
        })
        .then((data: { order: Order }) => {
          console.log(`successfully sent in request for: ${data.order.title}`)

          return data
        })
        .catch((error) => {
          console.error(`Error while trying to send order: ${error}.`)
        })

      return order
    } finally {
      setIsProcessingRequest(false)
    }
  }

  return (
    <div>
      <div className={`${styles.SearchBar} ${!userId ? styles.disabled : ''}`}>
        <input
          className={`${styles.input}`}
          type="text"
          placeholder="Whatever you want"
          value={title}
          spellCheck={false}
          onChange={(event) => {
            setTitle(event.target.value)
          }}
          onFocus={() => {
            if (!userId) {
              triggerLoginIndicator() // Call the login trigger if the user is not logged in
            }
          }}

        />
        <button className={`${styles.button}`} onClick={sendRequest} disabled={isProcessingRequest || !userId} ></button>
      </div>
    </div>
  )
}
