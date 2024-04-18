import { ReactNode, useContext, useState } from 'react'
import styles from '../style/Home.module.css'
import { AuthContext } from '../../../context/AuthContext'

const Searchbar = (): ReactNode => {
  const { userId } = useContext(AuthContext)
  // const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const [title, setTitle] = useState('')

  if (!userId) {
    // return same style div (TODO: we'll have to refactor out the)
  } else {
    return (
      <div
        className={styles.searchBar}
        onClick={() => sendRequest(userId, title)}
      >
        <input type="text" placeholder="What do you want?" />
        <button onClick={() => sendRequest(userId, title)}></button>
      </div>
    )
  }
}

export { Searchbar }

async function sendRequest(userId: string, title: string) {
  const endpoint = '/api/user/things'

  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/JSON',
      userId: userId,
    },
    body: JSON.stringify({ title: title }),
  })
    .then((res: Response) => {
      console.log(res.json)
    })
    .catch((error) => {
      console.log
      // set state of the modal that pops up when processing request to error when sendRequest fails.
      // the catch block is for network requests. this is diffferent from when we get a successfuly response but
    })
}
