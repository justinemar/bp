import React from 'react';
import fontawesome from '@fortawesome/fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import ellipsis from '@fortawesome/fontawesome-free-solid/faEllipsisH';
import newspaper from '@fortawesome/fontawesome-free-solid/faNewspaper';
import image from '@fortawesome/fontawesome-free-solid/faImage';
import bell from '@fortawesome/fontawesome-free-solid/faBell';
import edit from '@fortawesome/fontawesome-free-solid/faEdit';
import ban from '@fortawesome/fontawesome-free-solid/faBan';
import RootPage from './Root';
import Dashboard from './Dashboard';
import UserProfile from './UserProfile';
import { Route, Switch } from 'react-router-dom';
fontawesome.library.add(brands, ellipsis, newspaper, image, bell, edit, ban);
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