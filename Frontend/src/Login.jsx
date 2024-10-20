import React from 'react';

const Login = () => {
  return (
    <div className="h-screen bg-gray-300 bg-center flex items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-xs w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input className="w-full p-2 border rounded" type="email" placeholder="Email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input className="w-full p-2 border rounded" type="password" placeholder="Password" />
          </div>
          <button className="w-full bg-black text-white p-2 rounded mt-2">Sign In</button>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-gray-500 text-sm">Forgot password?</a>
        </div>
        <div className="mt-4 text-center">
          <a href="#" className="text-gray-500 text-sm">Don't have an account? <span className="text-blue-500">Sign up</span></a>
        </div>
      </div>
    </div>
  );
};

export default Login;
