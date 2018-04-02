import React from 'react';
import RootPage from './Root';
import Dashboard from './Dashboard';
import { Route, withRouter } from 'react-router-dom';

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