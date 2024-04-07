import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import logo from '../img/logo1.png'; 
import dummy from '../img/dummy.png';

const LoginPage = () => {
  let {loginUser} = useContext(AuthContext)

  return (
    <div className="bg-gradient-to-tr from-blue-600 via-purple-500 to-purple-700 h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-md max-w-6xl w-full">
        {/* Logo container */}
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="mb-0" />
        </div>

        <div className="flex flex-col lg:flex-row items-center bg-white p-4 max-w-6xl w-full">
          {/* Dummy image container */}
          <div className="lg:flex lg:w-1/2 lg:justify-center lg:items-center pr-10">
            <img src={dummy} alt="User Icon" className="w-70 h-70 object-cover object-center" />
          </div>
          
          {/* Form container */}
          <div className="w-full lg:w-1/2 pr-10">
            <h1 className="font-bold text-center text-2xl mb-6">User Login</h1>
            <form onSubmit={loginUser} className="space-y-6">
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  placeholder="Username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input
                  type="password"
                  id="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-500 focus:border-purple-500"
                  placeholder="******************"
                />
              </div>
      
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50"
              >
                Login
              </button>
            </form>
            
            {/* Link container */}
            <div className="flex justify-between text-sm font-medium text-gray-500 mt-6">
              <a href="forgot-password.html" className="hover:text-gray-900">Forgot Password?</a>
              <a href="register" className="hover:text-gray-900">Create your Account →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;