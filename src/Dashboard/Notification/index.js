import React from 'react';
import './notification.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'





class DashBoardNotificaiton extends React.Component {
    render(){
        const { recentUpdates } = this.props;
        let dataToRender = recentUpdates  ? recentUpdates.map(i => {
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


export default DashBoardNotificaiton;