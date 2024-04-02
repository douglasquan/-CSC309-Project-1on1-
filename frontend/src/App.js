import "./styles/index.css";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NavbarMenu from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <NavbarMenu />
          <PrivateRoute component={HomePage} path="/" exact/>
          <Route component={LoginPage} path="/login"/>
          <Route component={RegisterPage} path="/register"/>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
