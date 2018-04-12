import React from 'react';
import DashBoardStatusWrapper from './DashBoardStatusWrapper.jsx';
import moment from 'moment';




class DashBoardRecentsStatus extends React.Component{
    render(){
        const { recentUpdates } = this.props;
        const newest = recentUpdates && recentUpdates.length !== 0 ? 
        recentUpdates.map((cStatus, index) => {
                <DashBoardStatusWrapper cStatus={cStatus}/> 
        }) : null;
    
        return (
            <div>
                {newest}
            </div>
        )
    }
}


export default DashBoardRecentsStatus;