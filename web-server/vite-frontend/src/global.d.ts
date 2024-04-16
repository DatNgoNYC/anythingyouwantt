declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;  // this will be the google sign on property that is loaded on
  }
}

export {};
