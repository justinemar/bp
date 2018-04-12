import React from 'react';
import DashBoardPostLayout from './DashBoardPostLayout.jsx';
import DashBoardRecentsStatus from './DashBoardRecentsStatus.jsx';
import DashBoardStatusWrapper from './DashBoardStatusWrapper.jsx';
import moment from 'moment';

class DashBoardStatus extends React.Component{
    
    state = {
        getStatus: [],
        error: null
    }
    
    componentDidMount(){
      fetch('status', { 
         method: 'GET', 
         credentials: 'same-origin',
         headers: {
             "Authorization": 'Bearer ' + this.props.util.getToken()
         }
      })
        .then(res => res.json())
        .then(res => {
            if(res.code === 401){
                this.props.validate(res)
                return;
            }
            
            this.setState({
               getStatus: res
            })
        }).catch(err => err);
    }
    
    render(){
        const { recentUpdates} = this.props;
        const { getStatus } = this.state;
        const updates = getStatus && getStatus.length ? 
            getStatus.map((cStatus, index) => {
                return (
                    <DashBoardStatusWrapper cStatus={cStatus}/>  
                )
            }) : <DashBoardPostLayout/>
        const recent = recentUpdates && recentUpdates.length ?
            recentUpdates.reverse().map((cStatus, index) => {
                return (
                 <DashBoardStatusWrapper cStatus={cStatus}/> 
                )
            }) : null
        return (
           <div>
            {recent}
            {updates} 
           </div>
        )
    }
}


export default DashBoardStatus;