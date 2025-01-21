import { useEffect, useState } from "react";
import { useUser } from "./Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const { Auth, setAuth, setToken, setUserId } = useUser();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (Auth) {
      navigate("/profile");
    }
  }, [Auth, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email: e.target.email.value,
        password: e.target.password.value,
      });

      if (response.status === 200) {
        setAuth(true);
        setToken(response.data.token);
        setUserId(response.data.userId);

        if (response.data.firstLogin === true) {
          navigate("/update");
          return;
        }

        navigate("/profile");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-md max-w-xs w-full text-neutral-300">
        <h2 className="text-2xl font-bold text-purple-500 text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          {errorMessage && (
            <div className="bg-neutral-900 text-cyan-500 p-2 rounded mb-4">
              {errorMessage}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-neutral-100">Email</label>
            <input
              className="w-full p-2 border rounded bg-neutral-800 text-neutral-100 border-neutral-700"
              id="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-neutral-100">Password</label>
            <input
              className="w-full p-2 border rounded bg-neutral-800 text-neutral-100 border-neutral-700"
              id="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <button className="w-full bg-purple-500 text-black p-2 rounded mt-2 hover:bg-purple-400">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a className="text-neutral-100 text-sm">Forgot password?</a>
        </div>
        <div className="mt-4 text-center">
          <a className="text-neutral-100 text-sm">
            Don't have an account?{" "}
            <span
              className="text-purple-400 cursor-pointer hover:underline"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign up
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
