import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { UserInfo } from '../../../types';

export { You };

const You = (): React.JSX.Element => {
  const { userId } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    pfp: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadPage() {
      if (!userId) return;

      try {
        setLoading(true);
        const userData = await fetchUserData(userId);
        setUserInfo(userData);
        setLoading(false);
      } catch (error) {
        setError('Error while trying to fetch user info.');
        setLoading(false);
      }
    }

    loadPage();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error: ${error}`}</div>;

  return (
    <div>
      <h1>{userInfo.name}</h1>
      <h2>{userInfo.email}</h2>
      <img src={userInfo.pfp} alt="profile picture" />
    </div>
  );
};

async function fetchUserData(userId: string): Promise<UserInfo> {
  console.log(userId);

  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    name: 'Dat',
    email: 'datngonyc@gmail.com',
    pfp: `data:image/jpeg;base64,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`,
  };
}
