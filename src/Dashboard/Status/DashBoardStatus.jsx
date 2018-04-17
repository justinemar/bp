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
      this.props.util.fetch('status', { 
         method: 'GET', 
         credentials: 'same-origin',
      })
      .then(res => {
        if(res.code === 401){
            this.props.validate(res)
            return;
        }
        this.setState({
           getStatus: res
        })
      })
      .catch(err => err);
        
        socket.on('statusInit', (data) => {
          this.setState({
              recentUpdates: this.state.recentUpdates.concat(data).reverse()
          });
        });
    }
    
    render(){
        const { getStatus, recentUpdates } = this.state;
        const { util } = this.props;
        const updates = getStatus && getStatus.length || recentUpdates && recentUpdates.length ? 
            getStatus.map((cStatus, index) => {
                return (
                    <DashBoardStatusWrapper util={util} cStatus={cStatus} user={this.props.user}/>  
                )
            }) : <DashBoardPostLayout/>
        const newest = recentUpdates && recentUpdates.length ?
            recentUpdates.map((cStatus, index) => {
                return (
                    <DashBoardStatusWrapper util={util} cStatus={cStatus} user={this.props.user}/>    
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