import React from 'react';
import fontawesome from '@fortawesome/fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import {
 faSignOutAlt, faEllipsisH, faPlay, faEye, faSave, faBan, faEdit, faImage, faNewspaper, faSlidersH, faBell, faFistRaised 
} from '@fortawesome/free-solid-svg-icons';
import { Route, Switch } from 'react-router-dom';
import RootPage from './Root';
import Dashboard from './Dashboard';
import Verify from './Verify';
import Resend from './Resend';
fontawesome.library.add(faSignOutAlt, faPlay, faEye, faSave, faBan, faEdit, faImage, faNewspaper, faSlidersH, faBell, faFistRaised, faEllipsisH, brands);
class App extends React.Component {
    render() {
        return (
          <div>
           <Switch>
              <Route exact path="/" render={props => <RootPage {...props} />} />
              <Route path="/verifyEmail/:token" render={props => <Verify {...props} />} />
              <Route path="/resend/:email" render={props => <Resend {...props} />} />
              <Route path="/dashboard" render={props => <Dashboard {...props} />} />
            </Switch>
         </div>
            );
    }
}

export default App;
