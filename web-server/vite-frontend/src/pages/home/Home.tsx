// the Login Button and dashboard button will be conditionally rendered depending on whether the user is logged in.

import { AuthButton } from "./AuthButton";

function Home() {
  return (
    <div>
      <AuthButton />
      {/* <Logo />
      <SearchBar /> post request to create order in a nested modal */}
    </div>
  );
}

export default Home;
