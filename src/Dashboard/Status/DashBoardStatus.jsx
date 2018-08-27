import React from 'react';
import DashBoardPostLayout from './DashBoardPostLayout.jsx';
import DashBoardStatusWrapper from './DashBoardStatusWrapper.jsx';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');



class DashBoardStatus extends React.Component{
    
    constructor(){
        super();
        this.state = {
            getStatus: [],
            recentUpdates: [],
            error: null,
        }
    }
    
    subscribeStatus(){
        /* This throws a memory leak error even though the component was unmounted, indication that listener was not remove.
         Warning: Can't call setState (or forceUpdate) on an unmounted component. 
        This is a no-op, but it indicates a memory leak in your application. 
        To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method. */
        
        socket.on('statusInit', (data) => {
            console.log('Handle from dashboard')
            this.setState(prevState => ({
                recentUpdates: [...prevState.recentUpdates, data],
                getStatus:  [data, ...this.state.getStatus]
            }));
        });
    }
    // subscribeSocket(){
    //           socket.on('statusDelete', (data) => {
    //               const state = this.state.getStatus;
    //               const filtered = state.filter(obj => obj._id !== data[0]._id);
    //               this.setState({
    //                   getStatus: filtered
    //               });
    //           });
              
    //           socket.on('statusComment', (data) => {
    //               let mutator = [...this.state.getStatus];
    //               mutator[mutator.findIndex(i => i._id === data._id)].post_comments = data.post_comments
    //               this.setState({
    //                   getStatus: mutator
    //               })  
    //           });
    //   }
    
    componentDidMount(){
      this.props.util.fetch('/status', { 
         method: 'GET', 
         credentials: 'same-origin',
      })
      .then(res => {
        if(res.code === 401){
            this.props.timeOut(res);
            return;
        }
        this.setState({
          getStatus: res.data
        }, this.subscribeStatus());
      })
      .catch(err => console.log(err));
    }
     

     componentWillUnmount(){
        socket.off("statusInit"); 
     }

    render(){
        const { getStatus, recentUpdates } = this.state;
        const { util, validate } = this.props;
        const updates = getStatus && getStatus.length || recentUpdates && recentUpdates.length ? 
            getStatus.map((cStatus, index) => {
                return (
                    <DashBoardStatusWrapper key={cStatus._id} {...this.props} validate={validate} util={util} cStatus={cStatus} user={this.props.user}/>  
                );
            }) : <DashBoardPostLayout/>;
        return (
           <div>
            {updates} 
           </div>
        );
    }
}


export default DashBoardStatus;