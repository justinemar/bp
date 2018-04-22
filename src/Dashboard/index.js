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


const DashBoardTimeOut = ({validation}) => {
    return (
        <div>
        { validation.code === 401 ? 
                <div className="dashboard-timeout">
                    <div className="dashboard-timeout-content">
                            <h1> {validation.message} </h1>
                            <button onClick={() => this.props.history.push('/')}> Login to continue </button>
                    </div>
                </div> : null }  
        </div>
    )    
}

const DashBoardDataChange = ({dataChange}) => {
    return (
        <div>
            { dataChange ? 
                <div className="dashboard-change-notificaiton">
                    <div className="dashboard-change-content">
                            <h1> DATA CHANGE </h1>
                    </div>
                </div> : null }  
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
            tabToRender: null,
            dataChange: false
        };
        this.authUtil = new AuthService();
    }
    

    
    initLogout = () => {
         this.authUtil.logout();
    }
    
    
    validate = (res) => {
        if(res.code === 401) {
            this.setState({
                validation: {
                    message: res.message,
                    type: res.type,
                    code: res.code
                }
            }, this.initLogout())
            
            return;
        } 
    }
    
    renderTab = (tabName) => {
        this.setState({
            tabToRender: tabName
        })
    }
    
    dataChange = (newData, originalData) => {
        this.setState({
            dataChange: true
        })
    }
    
    render(){
        const { validation, dataChange } = this.state;
        return(
            <div className="dashboard-wrapper">
            <DashBoardTimeOut validation={validation}/>
            <DashBoardDataChange dataChange={dataChange}/>
                <div className="dashboard-main-content">
                    <DashBoardMenu tabRender={this.renderTab} props={this.props}/>
                    <DashBoardNotification/>
                       <Route path="/dashboard/setting" render={(props) => <MenuSetting dataChange={this.dataChange} {...this.props}/>}/>
                       <Route path="/dashboard/feed" render={(props) =>  <DashBoardStatusContainer validate={this.validate} {...this.props}/>}/>
                </div>
            </div>
        )
    }
    
}
export default withAuth(DashBoard);