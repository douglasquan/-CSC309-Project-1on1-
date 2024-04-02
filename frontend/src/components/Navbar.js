import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

const NavbarComponent = () => {
    let { user, logoutUser } = useContext(AuthContext);

    return (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={NavLink} to="/">MeetHomie</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {user ? (
                <>
                  <Nav.Link as="div" onClick={logoutUser}>Logout</Nav.Link>
                  <Nav.Item>
                    <Nav.Link as={NavLink} to="/profile" activeClassName="active">Hello, {user.username}</Nav.Link>
                  </Nav.Item>
                </>
              ) : (
                <>
                  <Nav.Item>
                    <Nav.Link as={NavLink} to="/login" activeClassName="active">Login</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as={NavLink} to="/register" activeClassName="active">Register</Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
    );
};

export default NavbarComponent;
