import React from 'react';
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

const NavbarMenu = () => {
    return (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={NavLink} to="/">MeetHomie</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto"> {/* Adjusted to 'ml-auto' for alignment to the right */}
              <Nav.Item>
                <Nav.Link as={NavLink} to="/login" activeClassName="active">Login</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/register" activeClassName="active">Register</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
    );
};

export default NavbarMenu;
