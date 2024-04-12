import { ReactNode, RefObject, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { CredentialResponse } from '../../../../types';
import styles from './GoogleSignInButton.module.css'

export { GoogleSignInButton };

type GoogleSignInProps = {
  isVisible: boolean
}

const GoogleSignInButton = ({isVisible} : GoogleSignInProps): ReactNode => {
  const buttonDivRef = useRef<HTMLDivElement>(null);
  useExternalGoogleScript(buttonDivRef);

  return <div ref={buttonDivRef} className={`${styles.googleSignInButton} ${isVisible ? `` : styles.hidden}`} />;
};

// This custom hook loads the google identity library which only accepts HtmlElements and not ReactNodes in its renderButton() method. That is why we have to pass it a 'ref' of the div. It will also serve to load the required script instead of attaching it to index.html. It is only accessible through client side scripting, no node package.
const useExternalGoogleScript = (containerRef: RefObject<HTMLElement>) => {
  const { setUserId } = useContext(AuthContext);

  useEffect(() => {
    const scriptId = 'google-identity-services';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
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
          width: '200',
          type: 'standard',
          shape: 'rectangular',
          text: 'continue_with',
        });
      };

      document.body.append(script);

    }

    // Callback will make an authorization request to our backend and set the authorization state of the app upon success.
    function handleCredentialResponse(credentialResponse: CredentialResponse) {
      console.log(`the response from google: ${credentialResponse.credential}`);
      setUserId('1');
      return;
    }
  });
};
