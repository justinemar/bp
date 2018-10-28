import React from 'react';
import DashBoardPostLayout from './DashBoardPostLayout.jsx';
import DashBoardStatusWrapper from './DashBoardStatusWrapper.jsx';
import openSocket from 'socket.io-client';
const socket = openSocket('/');



class DashBoardStatus extends React.Component{
    
    constructor(){
        super();
        this.state = {
            getStatus: [],
            recentUpdates: [],
            error: null
        }
        this.requestController = new AbortController();
    }
    

    subscribeEvents(){
        socket.on('statusDelete', (data) => {
            console.log(data)
            const state = this.state.getStatus;
            const filtered = state.filter(obj => obj._id !== data._id);
            console.log(filtered)
            this.setState({
                getStatus: filtered
            });
        });

        socket.on('statusComment', (data) => {
            let mutator = JSON.parse(JSON.stringify(this.state.getStatus));
            mutator.filter(i => i._id === data.status_id)[0].post_comments.push(data)
            this.setState({
                getStatus: mutator
            }) 
        });

        socket.on('statusInit', (data) => {
            this.setState(prevState => ({
                recentUpdates: [...prevState.recentUpdates, data],
                getStatus:  [data, ...this.state.getStatus]
            }));
        });
 
    }

    
    componentDidMount(){
        console.log(this.props.scroller.current); // NULL 
        console.log(this.props); // props object scroller is available 
        console.log(this.props.scroller.current); // null
        console.log(this.props.scroller); // props object scroller is available 
       this.getStatus(0);
    }
     
    getStatus = (offset) => {
        const { util } = this.props; 
        console.log(util)
        util.fetch(`/status?offset=${offset}`, { 
            method: 'GET', 
            credentials: 'same-origin',
            signal: this.requestController.signal
         })
         .then(res => {
           if(res.code === 401){
               this.props.timeOut(res);
               return;
           }
           this.setState({
              ...this.state.getStatus,
             getStatus: res.data
           }, this.subscribeEvents());
         })
         .catch(err => console.log(err));
    }

     componentWillUnmount(){
        this.requestController.abort();
        socket.off("statusInit");
        socket.off("statusDelete");  
        socket.off('statusComment');
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
           <div ref={(container) => this.statusContainer = container}>
            {updates} 
           </div>
        );
    }
}


export default DashBoardStatus;