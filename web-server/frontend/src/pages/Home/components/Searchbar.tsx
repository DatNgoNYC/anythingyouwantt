import { useContext, useState } from 'react'
import styles from '../Home.module.scss'
import { AuthContext } from '../../../context/AuthContext'

export const Searchbar = () => {
  const { userId } = useContext(AuthContext)
  const [title, setTitle] = useState('')
  const [isProcessingRequest, setIsProcessingRequest] = useState(false)

  async function sendRequest() {
    try {
      setIsProcessingRequest(true)
      const response = await fetch('/api/user/things', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          userId: userId as string,
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        console.error(`Failed to fulfilled request: ${title}.`)
      } else {
        const data = await response.json()
        console.log(`Successfully fulfilled request: ${data.title}.`)
      }
    } catch (error) {
      console.error(`There was an error: ${error}`)
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
          onClick={() => sendRequest()}
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
