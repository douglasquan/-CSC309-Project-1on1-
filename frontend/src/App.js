import "./styles/index.css";
import "./styles/output.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateEventPage from "./pages/CreateEventPage";
import ContactListPage from "./pages/ContactListPage";
import SubmitAvailabilityPage from "./pages/SubmitAvailabilityPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import FinalizeEventPage from "./pages/FinalizeEventPage";
import ViewEventPage from "./pages/ViewEventPage";
import LayoutWithNavbar from "./components/LayoutWithNavbar";
import { NotificationProvider } from "./components/NotificationContext";

function App() {
  return (
    <div className='App py-4'>
      <NotificationProvider>
        <Router>
          <AuthProvider>
            <Switch>
              <Route path='/login' component={LoginPage} />
              <Route path='/register' component={RegisterPage} />
              <Route path='/forgot-password' component={ForgotPasswordPage} />
              <Route
                path='/'
                render={() => (
                  <LayoutWithNavbar>
                    <Switch>
                      <PrivateRoute exact path='/' component={HomePage} />
                      <PrivateRoute exact path='/profile' component={ProfilePage} />
                      <PrivateRoute exact path='/create-event' component={CreateEventPage} />
                      <PrivateRoute exact path='/contact-list' component={ContactListPage} />
                      <PrivateRoute
                        exact
                        path='/submit-availability/event/:eventId/user/:userId'
                        component={SubmitAvailabilityPage}
                      />
                      <PrivateRoute
                        exact
                        path='/view/event/:eventId/user/:userId'
                        component={ViewEventPage}
                      />
                      <PrivateRoute
                        exact
                        path='/finalize-event/event/:eventId'
                        component={FinalizeEventPage}
                      />
                    </Switch>
                  </LayoutWithNavbar>
                )}
              />
            </Switch>
          </AuthProvider>
        </Router>
      </NotificationProvider>
    </div>
  );
}
export default App;
