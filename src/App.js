import React from 'react';
import fontawesome from '@fortawesome/fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import { faSignOutAlt, faPlay, faEye, faSave, faBan, faEdit, faImage, faNewspaper, faEllipsisH, faBell  } from '@fortawesome/fontawesome-free-solid';
import RootPage from './Root';
import Dashboard from './Dashboard';
import UserProfile from './UserProfile';
import { Route, Switch } from 'react-router-dom';
fontawesome.library.add(faSignOutAlt, faPlay, faEye, faSave, faBan, faEdit, faImage, faNewspaper, faEllipsisH, faBell, brands);
class App extends React.Component{
    render(){
        return (
         <div>
            <Switch>
                <Route exact path="/" render={(props) => <RootPage {...props}/>}/>
                <Route path="/dashboard" render={(props) => <Dashboard {...props}/>}/>
                <Route path="/:user/:status_id?" render={(props) => <UserProfile {...props}/>}/>
            </Switch>
         </div>
            );
    }
}

export default App;