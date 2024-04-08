import "./styles/index.css";
import './styles/output.css'; 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from "./pages/CreateEventPage";
import ContactListPage from "./pages/ContactListPage"
import SubmitAvailabilityPage from "./pages/SubmitAvailabilityPage"
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LayoutWithNavbar from "./components/LayoutWithNavbar";


function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>

          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/" render={() => (
              <LayoutWithNavbar>
                <Switch>
                  <PrivateRoute exact path="/" component={HomePage} />
                  <PrivateRoute exact path="/profile" component={ProfilePage} />
                  <PrivateRoute exact path="/create-event" component={CreateEventPage} />
                  <PrivateRoute exact path="/contact-list" component={ContactListPage} />
                  <PrivateRoute exact path="/submit-availability/event/:eventId/user/:userId" component={SubmitAvailabilityPage} />

                </Switch>
              </LayoutWithNavbar>
            )} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}
export default App;