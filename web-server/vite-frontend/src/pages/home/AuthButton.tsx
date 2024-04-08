import { ReactNode, useEffect, useRef } from 'react';

// the authbutton needs to use the authcontext but for now let's just render the google sign in
export function AuthButton(): ReactNode {
  // instantiate google sign in

  return <GoogleSignIn />;
}

function GoogleSignIn(): ReactNode {
  const buttonDivRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: '298422396148-geun3f7crbkltsuvuv0iene4gbrjmeub.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        buttonDivRef.current,
        { theme: 'outline', size: 'large'}
      )
    };

    document.body.append(script)
  });

  const handleCredentialResponse = (response: string) => {
    console.log(`the response from google: ${response}`) 
  }

  return <div ref={buttonDivRef}></div>
}
