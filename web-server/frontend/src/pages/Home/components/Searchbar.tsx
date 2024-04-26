import { useContext, useState } from 'react'
import styles from '../Home.module.scss'
import { AuthContext } from '../../../context/AuthContext'
import { Order } from '../../../types'

export const Searchbar = () => {
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
      <div className={`${styles.SearchBar} ${userId ? '' : styles.hidden}`}>
        <input
          type="text"
          placeholder="What do you want?"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
          }}
        />
        <button
          onClick={sendRequest}
          disabled={isProcessingRequest}
        ></button>
      </div>
      {/* 
      {isProcessingRequest ? (
        <RequestModal
          userId={userId as string} // Assumed non-null since the searchBar is visible
          title={title}
          closeModal={() => setIsProcessingRequest(false)}
        />
      ) : (
        ''
      )} */}
    </div>
  )
}

// type RequestModalProps = {
//   userId: string
//   title: string
//   closeModal: () => void
// }

// const RequestModal: React.FC<RequestModalProps> = ({
//   userId,
//   title,
//   closeModal,
// }) => {
//   // const [isInTransit, setIsInTransit] = useState(true)
//   async function sendRequest() {
//     try {
//       const response = await fetch('/api/user/things', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', userId },
//         body: JSON.stringify({ title }),
//       })

//       if (!response.ok) {
//         console.error(`Failed to fulfilled request: ${title}.`)
//       } else {
//         const data = await response.json()
//         console.log(`Successfully fulfilled request: ${data.title}.`)
//       }
//     } catch (error) {
//       console.error(`There was an error: ${error}`)
//     } finally {
//       closeModal()
//     }
//   }

//   useEffect(() => {
//     sendRequest()
//   }, [])

//   return <div></div>
// }
