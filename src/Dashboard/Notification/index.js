import React from 'react';
import './notification.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');




class DashBoardNotification extends React.Component {
    
    state = {
        notifications: []
    }
    
    subscribeStatus(){
        socket.on('notification', (data) => {
            this.setState(prevState => ({
                notifications: [data, ...prevState.notifications]
            }));
          });
    }

    componentDidMount(){
        this.subscribeStatus();
    }   
    


    render(){
        const { notifications } = this.state;
        let dataToRender = notifications  ? notifications.map(i => {
            return (
                <div className="a-notification" style={{backgroundImage: `url(${i.post_img[0]})`}}>
                               <div className="notification-detail">
                        <p><span>{`A new update from ${i.post_by.display_name}`}</span></p>
                        <p>{`${i.post_description}`}</p>
                    </div>
                </div> )
        }) : null
        return (
            <div className="dashboard-notification">
                <span className="dashboard-notification-title">
                    Recent Updates
                    <button onClick={() => this.turnOff()}>Turn off</button>
                </span>
                <div className="dashboard-notification-main">
                    {dataToRender} 
                 </div>
            </div>
        )
    }
}


export default DashBoardNotification;