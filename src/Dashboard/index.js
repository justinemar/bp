import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import DashBoardStatusContainer from './Status';
import DashBoardNotification from './Notification';
import DashBoardMenu from './Menu';
import Home from './Home';
import MenuSetting from './Menu/Setting';
import MenuProfile from './Menu/Profile';
import AuthService from '../utils/authService';
import withAuth from '../utils/withAuth';
import './dashboard.css';


const DashBoardTimeOut = ({validation, initLogout}) => {
    return (
        <div>
        { validation.code === 401 ? 
                <div className="dashboard-timeout">
                    <div className="dashboard-timeout-content">
                            <h1> {validation.message} </h1>
                            <button onClick={() => initLogout()}> Login to continue </button>
                    </div>
                </div> : null }  
        </div>
    );
};

const DashBoardDataChange = ({validation, notification_className}) => {
    return (
        <div className="dashboard-change-notificaiton">
            <div className={`dashboard-change-content ${notification_className}`}>
            <FontAwesomeIcon className="change-icon" icon="save"/>
                    <h1>{validation.message}</h1>
            </div>
        </div> 
    );    
};


const LogoutButton = ({initLogout}) => {
    return (
        <div class="logout-wrapper">
            <div className="logout-icon">
                <FontAwesomeIcon onClick={initLogout} icon="sign-out-alt"/>
            </div>
        </div>
    )
}


class DashBoard extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            validation: {
                message: null,
                type: null,
                code: null
              },
            notification_className: 'nonactive-class'
        };
        this.authUtil = new AuthService();
        this.timeOut;
    }

    removeChageNotification = () => {
        this.setState({
            notification_className: 'nonactive-class'
        });
        clearTimeout(this.timeOut);
    }
    
    dataChange = (res) => {
            this.setState({
                notification_className: 'active-class',
                validation: {
                    message: res.message,
                    code: res.code,
                    type: res.type
                }
            }, res.code===200 ? this.props.updateUser(res.token) : null);
            
            this.timeOut = setTimeout(() => {
              this.removeChageNotification();
            }, 3000);
    }
    
    render(){
        const { validation,  notification_className } = this.state;
        return(
            <div className="dashboard-wrapper">
            <LogoutButton initLogout={this.props.logout}/>
            <DashBoardDataChange notification_className={notification_className} validation={validation}/>
                <div className="dashboard-main-content">
                    <DashBoardMenu {...this.props}/>
                    <DashBoardNotification/>
                        <Switch>
                           <Route path="/dashboard" exact render={(props) => <Home Auth={this.authUtil} {...this.props}/>}/>
                           <Route path="/dashboard/setting" render={(props) => <MenuSetting dataChange={this.dataChange} {...this.props}/>}/>
                           <Route path="/dashboard/feed" render={(props) =>  <DashBoardStatusContainer {...this.props}/>}/>
                           <Route path="/dashboard/:user_id" render={(props) =>  <MenuProfile timeOut={this.props.timeOut} user={this.props.user} Auth={this.authUtil} dataChange={this.dataChange} {...props}/>}/>
                        </Switch>
                </div>
            </div>
        );
    }
    
}
export default withAuth(DashBoard);