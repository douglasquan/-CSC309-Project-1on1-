import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const NavbarComponent = () => {
  let { user, logoutUser } = useContext(AuthContext);
  console.log("Is Logged In:", user);

  return (
    <nav className="bg-sky-300	 border-gray-200 px-2 sm:px-4 py-2.5">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <NavLink to="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Home</span>
        </NavLink>
        <div className="flex md:order-2">
          {user ? (
            <>
              <button onClick={logoutUser} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Logout</button>
              <NavLink to="/profile" activeClassName="text-blue-700" className="text-sm text-gray-700 hover:bg-gray-50 rounded-lg px-5 py-2.5 ml-2">Profile</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" activeClassName="text-blue-700" className="text-sm text-gray-700 hover:bg-gray-50 rounded-lg px-5 py-2.5">Login</NavLink>
              <NavLink to="/register" activeClassName="text-blue-700" className="text-sm text-gray-700 hover:bg-gray-50 rounded-lg px-5 py-2.5 ml-2">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
