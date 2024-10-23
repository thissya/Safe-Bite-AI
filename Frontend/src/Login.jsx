import { useEffect, useState } from "react";
import { useUser } from "./Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const { Auth, setAuth, setToken, setUserId } = useUser();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // State for managing error messages

  useEffect(() => {
    if (Auth) {
      navigate("/profile");
    }
  }, [Auth, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear error message before making the request
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email: e.target.email.value,
        password: e.target.password.value
      });

      if (response.status === 200) {
        setAuth(true);
        setToken(response.data.token);
        setUserId(response.data.userId);

        if (response.data.firstLogin === true) {
          navigate('/update');
          return;
        }

        navigate('/profile');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle unauthorized (incorrect credentials)
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        // Handle other errors
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="h-screen bg-gray-300 bg-center flex items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-xs w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {errorMessage}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input className="w-full p-2 border rounded" id='email' type="email" placeholder="Email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input className="w-full p-2 border rounded" id="password" type="password" placeholder="Password" />
          </div>
        
          <button className="w-full bg-black text-white p-2 rounded mt-2">Login</button>
        </form>
        <div className="mt-4 text-center">
          <a className="text-gray-500 text-sm">Forgot password?</a>
        </div>
        <div className="mt-4 text-center">
          <a className="text-gray-500 text-sm">Don't have an account? <span className="text-blue-500" onClick={() => { navigate('/signup') }}>Sign up</span></a>
        </div>
      </div>
    </div>
  );
};

export default Login;
