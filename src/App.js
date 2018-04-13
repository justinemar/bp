import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import brands from '@fortawesome/fontawesome-free-brands'
import ellipsis from '@fortawesome/fontawesome-free-solid/faEllipsisH'
import newspaper from '@fortawesome/fontawesome-free-solid/faNewspaper'
import image from '@fortawesome/fontawesome-free-solid/faImage'
import bell from '@fortawesome/fontawesome-free-solid/faBell'
import RootPage from './Root';
import Dashboard from './Dashboard';
import MenuSetting from './Dashboard/Menu/MenuSetting';
import { Route } from 'react-router-dom';
fontawesome.library.add(brands, ellipsis, newspaper, image, bell)
class App extends React.Component{
    render(){
        return (
         <div>
            <Route exact path="/" render={(props) => <RootPage {...props}/>}/>
            <Route path="/dashboard" render={(props) => <Dashboard {...props}/>}/>
         </div>
            )
    }
}

export default App;