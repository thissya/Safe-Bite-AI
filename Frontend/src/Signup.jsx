import React from 'react';

const Signup = () => {
  return (
    <div className="h-screen bg-gray-300 bg-center flex items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-xs w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input className="w-full p-2 border rounded" type="text" placeholder="Name" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input className="w-full p-2 border rounded" type="email" placeholder="Email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input className="w-full p-2 border rounded" type="password" placeholder="Password" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input className="w-full p-2 border rounded" type="password" placeholder="Confirm Password" />
          </div>
          <button className="w-full bg-black text-white p-2 rounded mt-2">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
