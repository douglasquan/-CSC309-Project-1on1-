import "./styles/index.css";
import './styles/output.css'; 
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NavbarMenu from "./components/Navbar";
import CreateEventPage from "./pages/CreateEventPage";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <NavbarMenu />
          <PrivateRoute component={HomePage} path="/" exact/>
          <PrivateRoute component={CreateEventPage} path="/create-event" exact/>
          <Route component={LoginPage} path="/login"/>
          <Route component={RegisterPage} path="/register"/>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
