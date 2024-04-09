import { RefObject, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../../context/AuthContext';

function GoogleSignInButton() {
  const buttonDivRef = useRef<HTMLDivElement>(null);
  useGoogleSignInHook(buttonDivRef);

  return <div ref={buttonDivRef} />;
}

// we have to use this custom hook (the useEffect) because the google library only accepts HtmlElements and not React nodes in the renderButton() method. It will also serve to load the required script. It is only accessible through url download, no node package.
const useGoogleSignInHook = (containerRef: RefObject<HTMLElement>) => {
  const { setUserId } = useContext(AuthContext)
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id:
          '298422396148-geun3f7crbkltsuvuv0iene4gbrjmeub.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(containerRef.current, {
        theme: 'filled_black',
        size: 'medium',
        type: 'standard',
        shape: 'rectangular',
        text: 'continue_with',
      });
    };

    document.body.append(script);
  });

  // we know that the response parameter will be a 'CredentialResponse' according to the docs.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleCredentialResponse(credentialResponse: CredentialResponse) {
    console.log(`the response from google: ${credentialResponse.credential}`);
    setUserId("1")
    return;
  }
}

export { GoogleSignInButton };

type CredentialResponse = {
  credential: string;
};
