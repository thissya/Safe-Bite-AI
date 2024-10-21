import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleAPI = async (e) => {
    e.preventDefault();

    // Validation to check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/signup', {
        name,
        email,
        password,
        confirmPassword,
      });

      if (response.status === 200) {
        console.log('Registration successful');
        navigate('/');
      } else {
        console.log('Registration failed');
      }
    } catch (e) {
      console.error('An error occurred during registration:', e);
    }
  };

  return (
    <div className="h-screen bg-gray-300 bg-center flex items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-xs w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleAPI}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              className="w-full p-2 border rounded"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              className="w-full p-2 border rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              className="w-full p-2 border rounded"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded mt-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

