import { RefObject, useEffect, useRef, useState } from 'react'
import './Home.scss'
import React from 'react'
import { useCurrentUserContext } from '../../hooks/CurrentUserContext'
import useIsDashboardActiveContext from '../../hooks/DashboardActiveContext'
import { CredentialResponse, User } from '../../types/types'

export default function Home(): React.JSX.Element {
  const { currentUser } = useCurrentUserContext()
  const { setIsDashboardActive } = useIsDashboardActiveContext()

  return (
    <div className="home">
      <div className="button-container">
        <button
          hidden={currentUser === null}
          className="dashboard-button"
          onClick={() => {
            setIsDashboardActive(true)
          }}
        >
          Dashboard
        </button>
        <GoogleButton />
        {/* <MockSignInButton /> */}
      </div>

      <div className="vertical-flex-container">
        <div className="logo">
          <span className={`desktop `}>
            Anything You Wantt.
            <span className={`strikethrough ${!currentUser ? 'active' : ''}`}>-</span>
          </span>
          <span className={`mobile `}>
            <span
              className={`strikethrough strikethrough-anything ${!currentUser ? 'active' : ''}`}
            >
              -
            </span>
            {`Anything\n`}
            <span className={`dash ${currentUser ? 'active-dash' : ''}`}>-</span>
            {' You '}
            <span className={`dash ${currentUser ? 'active-dash' : ''}`}>-</span>
            {`\nWantt`}
            <span className={`strikethrough strikethrough-you ${!currentUser ? 'active' : ''}`}>
              -
            </span>
            <span className={`strikethrough three ${!currentUser ? 'active' : ''}`}>-</span>
          </span>
        </div>
        <SearchBar />
      </div>
    </div>
  )
}

/* function MockSignInButton(): React.JSX.Element {
  const { currentUser, setCurrentUser } = useCurrentUserContext()

  return (
    <button
      hidden={currentUser !== null}
      className="dashboard-button"
      onClick={() => {
        setCurrentUser({
          pfp: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg',
          name: 'Barack Hussein Obama',
          email: 'hussein@whitehouse.gov',
        })
      }}
    >
      Google Button
    </button>
  )
} */

function GoogleButton(): React.JSX.Element {
  const { currentUser, setCurrentUser } = useCurrentUserContext()

  const buttonDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    renderButton(buttonDivRef, async (credentialResponse: CredentialResponse) => {
      try {
        const url = '/api/user'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            googleIdToken: credentialResponse.credential,
          }),
        }

        console.log('sending POST /api/user request with googleIdToken for authentication.')
        const res = await fetch(url, options)

        if (!res.ok) {
          console.error('Unexpected error:', res)
          return
        }

        const user = (await res.json()) as User

        if (res.status === 200) {
          console.log('User successfully logged in:', user)
        } else if (res.status === 201) {
          console.log('User registered successfully:', user)
        }

        setCurrentUser(user)
      } catch (error) {
        console.log('Unexpected error:', error)
      }
    })
  })

  return <div hidden={currentUser !== null} ref={buttonDivRef} />
}

function SearchBar(): React.JSX.Element {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'enabled' | 'submitting'>('enabled')
  const { currentUser } = useCurrentUserContext()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (!isValidInput(text)) return

    if (currentUser) {
      void postOrderApiRequest(text, currentUser.userId)
    }
    setStatus('submitting')
    clearInputAnimation(text, setText, () => {
      setStatus('enabled')
    })
  }

  return (
    <div className={`search-bar ${currentUser ? '' : 'disabled'}`}>
      <input
        ref={inputRef}
        disabled={currentUser === null}
        enterKeyHint="send"
        spellCheck="false"
        placeholder={'      type here'}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit()
          } else if (e.key === 'Escape') {
            inputRef.current?.blur()
          }
        }}
        onFocus={() => {
          scrollToElement(inputRef)
        }}
        readOnly={status === 'submitting'}
      />
      <button
        className={status === 'submitting' ? 'glow' : ''}
        onClick={handleSubmit}
        disabled={currentUser === null}
      >
        🔍
      </button>
    </div>
  )
}

// Utility and DOM manipulation functions

// Custom function to render the Google Sign In as directed by api guidelines.
const renderButton = (
  containerRef: RefObject<HTMLElement>,
  onLogin: (credentialResponse: CredentialResponse) => Promise<void>
) => {
  const scriptId = 'google-identity-services'
  let script = document.getElementById(scriptId) as HTMLScriptElement | null

  if (!script) {
    script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      window.google.accounts.id.initialize({
        client_id: '492658731857-u2ostbl60d8atrak43k769v90us3a5ei.apps.googleusercontent.com',
        callback: onLogin,
      })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: 'filled_black',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: 'continue_with',
      })
    }

    document.body.append(script)
  }
}

const postOrderApiRequest = async (text: string, userId: string) => {
  try {
    const url = '/api/order'
    const options = {
      method: 'POST',
      headers: {
        Authorization: userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: text,
      }),
    }

    console.log('Sending POST /api/order request for:', text)
    const res = await fetch(url, options)

    if (!res.ok) {
      console.error('Unexpected error:', res)
      return
    }

    console.log('Request made successfully:', res)
  } catch (error) {
    console.log('Unexpect error:', error)
  }
}

const clearInputAnimation = (
  text: string,
  setText: React.Dispatch<React.SetStateAction<string>>,
  onComplete: () => void,
  delay = 1000,
  duration = 700 + text.length * 25
) => {
  const textLength = text.length
  const interval = textLength > 0 ? duration / textLength : 0

  let currentText = text

  const step = () => {
    currentText = currentText.slice(0, -1)
    setText(currentText)

    if (currentText.length > 0) {
      setTimeout(step, interval)
    } else {
      setTimeout(onComplete, interval)
    }
  }

  setTimeout(step, delay)
}

const scrollToElement = (ref: React.RefObject<HTMLElement>, offset = 0) => {
  setTimeout(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()

      const scrollToPosition = window.scrollY + rect.top + offset - 0.65 * window.innerHeight

      window.scrollTo({ top: scrollToPosition, behavior: 'smooth' })
    }
  }, 100)
}

const isValidInput = (text: string) => {
  const trimmedText = text.trim()

  return trimmedText !== ''
}
