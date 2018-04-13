import React from 'react';
import './notification.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import openSocket from 'socket.io-client';
const socket = openSocket('/');




class DashBoardNotification extends React.Component {
    
    state = {
        notifications: []
    }
    componentDidMount(){
        socket.on('statusInit', (data) => {
          console.log('Notification', data)
          this.setState({
              notifications: this.state.notifications.concat(data)
          });
        });
    }   
    render(){
        const { notifications } = this.state;
        let dataToRender = notifications  ? notifications.map(i => {
            return (
                <div className="a-notification" style={{backgroundImage: `url(${i.post_img[0]})`}}>
                    <div className="notification-detail">
                        <p><span>{`A new update from ${i.post_by}`}</span></p>
                        <p>{`${i.post_description}`}</p>
                    </div>
                </div> )
        }) : null
        return (
            <div className="dashboard-notification">
                <span className="dashboard-notification-title">
                    Recent Updates
                </span>
                <div className="dashboard-notification-main">
                    {dataToRender} 
                 </div>
            </div>
        )
    }
}


export default DashBoardNotification;