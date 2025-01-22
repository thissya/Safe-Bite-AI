import axios from 'axios';
import { useUser } from './Context';
import { useEffect } from 'react';

const AxiosSetup = () => {
  const { token, setToken, Auth, setAuth, userInfo, setUserInfo } = useUser();
  axios.defaults.baseURL = 'https://food-safety-checker.onrender.com/api';

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [Auth, token, userInfo]);



  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        setAuth(false);
        setUserInfo(null);
        setToken('');
      }
      return Promise.reject(error);
    }
  );
  return null
};




export default AxiosSetup;
