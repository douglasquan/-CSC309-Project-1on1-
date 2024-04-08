import React from 'react';
import NavbarMenu from './Navbar'; // Assuming you have a Navbar component

const LayoutWithNavbar = ({ children }) => {
  return (
    <div className="layout-with-navbar">
      <NavbarMenu /> {/* Your navigation bar component */}
      <div className="content">
        {children} {/* Content passed as children to the LayoutWithNavbar component */}
      </div>
    </div>
  );
};

export default LayoutWithNavbar;
