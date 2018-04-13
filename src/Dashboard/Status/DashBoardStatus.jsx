import React from 'react';
import DashBoardPostLayout from './DashBoardPostLayout.jsx';
import DashBoardStatusWrapper from './DashBoardStatusWrapper.jsx';
import openSocket from 'socket.io-client';
const socket = openSocket('/');

class DashBoardStatus extends React.Component{
    
    state = {
        getStatus: [],
        recentUpdates: [],
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
        
        socket.on('statusInit', (data) => {
          console.log('Main DashBoard', data)
          this.setState({
              recentUpdates: this.state.recentUpdates.concat(data)
          });
        });
    }
    
    render(){
        const { getStatus, recentUpdates } = this.state;
        const updates = getStatus && getStatus.length ? 
            getStatus.map((cStatus, index) => {
                return (
                    <DashBoardStatusWrapper cStatus={cStatus}/>  
                )
            }) : <DashBoardPostLayout/>
        const newest = recentUpdates && recentUpdates.length ?
            recentUpdates.map((cStatus, index) => {
                return (
                    <DashBoardStatusWrapper cStatus={cStatus}/>    
                )
            }) : null
        return (
           <div>
            {newest}
            {updates} 
           </div>
        )
    }
}


export default DashBoardStatus;