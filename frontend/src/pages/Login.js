import React, { useState } from 'react';
import logo from '../img/logo1.png'; 
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../services/api";

const Login = () => {

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  // Handle input change
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const res = await api.post('login/', credentials)
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

    } catch (error) {
        alert(error)
    } finally {
        // setLoading(false)
    }

  };

  return (
    <div className="bg-custom-gradient flex items-center justify-center h-screen">
      <div className="form-container max-h-screen overflow-y-auto flex flex-col items-center p-8">
        <img src={logo} alt="MeetHomie Logo" className="mb-4" />
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" name="username" type="text" placeholder="Username" value={credentials.username} onChange={handleChange} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" name="password" type="password" placeholder="******************" value={credentials.password} onChange={handleChange} />
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Sign In
              </button>
              <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="forgot-password.html">
                Forgot Password?
              </a>
            </div>
            <div className="mt-4">
              <a href="register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-center block">
                Create Account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
