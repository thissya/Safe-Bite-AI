import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [Auth, setAuth] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  return (
    <UserContext.Provider value={{ token, setToken, Auth, setAuth, userInfo, setUserInfo, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
