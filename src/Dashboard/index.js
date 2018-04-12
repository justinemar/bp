import React from 'react';
import DashBoardStatusContainer from './Status';
import DashBoardNotification from './Notification';
import DashBoardMenu from './Menu';
import MenuGroups from './Menu/MenuGroups.jsx';
import MenuSetting from './Menu/MenuSetting.jsx';
import openSocket from 'socket.io-client';
import AuthService from '../utils/authService';
import withAuth from '../utils/withAuth';
import './dashboard.css';
const socket = openSocket('/');


class DashBoard extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            validation: {
                message: null,
                type: null,
                code: null
            },
            recentUpdates: [],
            status: [],
            tabToRender: null
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
    
    componentDidMount(){
        socket.on('statusInit', (data) => {
          console.log('Main DashBoard', data)
          this.setState({
              status: this.state.status.concat(data),
              recentUpdates: this.state.recentUpdates.concat(data)
          });
        });
    }   
    render(){
        const { recentUpdates, validation, status } = this.state;
        const { user } = this.props;
        return(
            <div className="dashboard-wrapper">
            { validation.code === 401 ? 
                <div className="dashboard-timeout">
                    <div className="dashboard-timeout-content">
                            <h1> Your session has expired, please login to continue where you left off </h1>
                            <button onClick={() => this.props.history.push('/')}> Login to continue </button>
                    </div>
                </div> : null }
                <div className="dashboard-main-content">
                    <DashBoardMenu tabRender={this.renderTab}/>
                    <DashBoardNotification recentUpdates={recentUpdates}/>
                    <DashBoardStatusContainer user={user} validate={this.validate}/>
                    </div>
                </div>
        )
    }
    
}


export default withAuth(DashBoard);