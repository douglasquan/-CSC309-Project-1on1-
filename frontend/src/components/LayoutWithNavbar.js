import React from 'react';
import NavbarComponent from './Navbar'; // Make sure this path is correct

const LayoutWithNavbar = ({ children }) => {
  return (
    <div className="flex">
      <NavbarComponent />
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default LayoutWithNavbar;