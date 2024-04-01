import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import NavbarMenu from './components/Navbar';

function App() {
  return (
    <div className="App">

      <div>
        <Router>
        <NavbarMenu/>
          <Routes>
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
