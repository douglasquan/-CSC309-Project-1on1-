import "./styles/index.css";
import './styles/output.css'; 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LayoutWithNavbar from "./components/Navbar";
import CreateEventPage from "./pages/CreateEventPage";
import ContactListPage from "./pages/ContactListPage"
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <LayoutWithNavbar>
              <PrivateRoute component={HomePage} path="/" exact />
              <PrivateRoute component={CreateEventPage} path="/create-event" exact />
              <PrivateRoute component={ContactListPage} path="/contact-list" exact />
            </LayoutWithNavbar>
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
