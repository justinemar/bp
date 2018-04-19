import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DashBoardStatusContainer from './Status';
import DashBoardNotification from './Notification';
import DashBoardMenu from './Menu';
import MenuGroups from './Menu/MenuGroups.jsx';
import MenuSetting from './Menu/Setting';
import openSocket from 'socket.io-client';
import AuthService from '../utils/authService';
import withAuth from '../utils/withAuth';
import './dashboard.css';



class DashBoard extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            validation: {
                message: null,
                type: null,
                code: null
            },
            tabToRender: null
        };
        this.authUtil = new AuthService();
    }
    

    
    initLogout = () => {
         this.props.history.push('/', this.authUtil.logout());
    }
    
    
    validate = (res) => {
        if(res.code === 401) {
            this.setState({
                validation: {
                    message: res.message,
                    type: res.type,
                    code: res.code
                }
            })
            
            return;
        } 
    }
    
    renderTab = (tabName) => {
        this.setState({
            tabToRender: tabName
        })
    }
    
    render(){
        const { validation, } = this.state;
        const { user } = this.props;
        return(
            <div className="dashboard-wrapper">
            { validation.code === 401 ? 
                <div className="dashboard-timeout">
                    <div className="dashboard-timeout-content">
                            <h1> {validation.message} </h1>
                            <button onClick={this.initLogout}> Login to continue </button>
                    </div>
                </div> : null }
                <div className="dashboard-main-content">
                    <DashBoardMenu tabRender={this.renderTab} props={this.props}/>
                    <DashBoardNotification/>
                        <Route path="/dashboard/setting" component={MenuSetting}/>
                        <Route path="/dashboard/feed" render={(props) =>  <DashBoardStatusContainer user={user} validate={this.validate} {...props}/>}/>
                </div>
            </div>
        )
    }
    
}


export default withAuth(DashBoard);