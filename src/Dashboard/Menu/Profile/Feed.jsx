import React from 'react';
import DashBoardStatusWrapper from '../../Status/DashBoardStatusWrapper.jsx';
import DashBoardPostLayout from '../../Status/DashBoardPostLayout.jsx';
import openSocket from 'socket.io-client';
const socket = openSocket('/');

class Feed extends React.Component{
    constructor(){
        super();
        this.state = {
            userPosts: null,
        }
    }
    
    
    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.match.params.user_id !== this.props.match.params.user_id){
            this.fetchPost();
        }
    }
    
    subscribeEvents(){
        socket.on('statusDelete', (data) => {
            const state = this.state.userPosts;
            const filtered = state.filter(obj => obj._id !== data[0]._id);
            this.setState({
                userPosts: filtered
            });
        });
    }

    componentDidMount(){
      this.subscribeEvents();
      this.fetchPost();
    }

    componentWillUnmount(){
        socket.off("statusDelete");  
    }

    fetchPost = () => {
        fetch(`/status/${this.props.match.params.user_id}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.props.Auth.getToken()
            }
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                userPosts: res.data
            })
        })
        .catch(err => console.log(err))
    }
    render(){
        const { userPosts } = this.state;
        const owned_post = userPosts ? 
            userPosts.map((cStatus, index) => {
                return (
                    <DashBoardStatusWrapper key={cStatus._id} {...this.props} util={this.props.Auth} cStatus={cStatus} user={this.props.user}/>  
                )  
            }) : <DashBoardPostLayout/>;
        return (
            <div>
               {owned_post}
            </div>
        )
    }
}


export default Feed;