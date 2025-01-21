import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAPI = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/signup", {
        name,
        email,
        password,
        confirmPassword,
      });

      if (response.status === 200) {
        console.log("Registration successful");
        navigate("/");
      } else {
        console.log("Registration failed");
      }
    } catch (e) {
      console.error("An error occurred during registration:", e);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
  <div className="bg-neutral-900 p-8 rounded-lg shadow-md max-w-xs w-full text-neutral-300">
    <h2 className="text-2xl font-bold text-purple-500 text-center mb-4">Register</h2>
    {error && (
      <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
    )}
    <form onSubmit={handleAPI}>
      <div className="mb-4">
        <label className="block text-neutral-100">Name</label>
        <input
          className="w-full p-2 border rounded bg-neutral-800 text-neutral-100 border-neutral-700"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-neutral-100">Email</label>
        <input
          className="w-full p-2 border rounded bg-neutral-800 text-neutral-100 border-neutral-700"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-neutral-100">Password</label>
        <input
          className="w-full p-2 border rounded bg-neutral-800 text-neutral-100 border-neutral-700"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-neutral-100">Confirm Password</label>
        <input
          className="w-full p-2 border rounded bg-neutral-800 text-neutral-100 border-neutral-700"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button className="w-full bg-purple-500 text-black p-2 rounded mt-2 hover:bg-purple-400">
        Sign up
      </button>
    </form>
    <div className="mt-4 text-center">
      <a className="text-neutral-100 text-sm">
        Already have an account?{" "}
        <span
          className="text-purple-400 cursor-pointer hover:underline"
          onClick={handleLoginClick}
        >
          Login
        </span>
      </a>
    </div>
  </div>
</div>

  );
};

export default Signup;
