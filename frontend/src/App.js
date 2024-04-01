import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NavbarMenu from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"

import "./styles/index.css";

function App() {
  return (
    <Router>
      <NavbarMenu />
      <Routes>
      <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
