import React from 'react';
import fontawesome from '@fortawesome/fontawesome';
import { faSearchengin } from '@fortawesome/fontawesome-free-brands';
import {
 faSignOutAlt, faEllipsisH, faPlay, faEye, faSave, faBan, faEdit, faImage, faNewspaper,
 faSlidersH, faBell, faFistRaised, faCrown, faAngleDoubleLeft, faBars, faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { Route, Switch } from 'react-router-dom';
import RootPage from './Root';
import Dashboard from './Dashboard';
import Verify from './Verify';

fontawesome.library.add(faSearchengin, faTimes, faBars, faAngleDoubleLeft, faCrown, faSignOutAlt, faPlay, faEye, faSave, faBan, faEdit, faImage, faNewspaper, faSlidersH, faBell, faFistRaised, faEllipsisH);
class App extends React.Component {
    render() {
        return (
          <div>
            <Switch>
              <Route exact path="/" render={props => <RootPage {...props} />} />
              <Route path="/verifyEmail/:token" render={props => <Verify {...props} />} />
              <Route path="/dashboard" render={props => <Dashboard {...props} />} />
            </Switch>
          </div>
            );
    }
}

export default App;
