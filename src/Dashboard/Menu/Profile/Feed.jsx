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
    
    requestController = new AbortController();
    componentDidUpdate(prevProps){
        if(prevProps.match.params.user_id !== this.props.match.params.user_id){
            this.fetchPost();
        } else if(prevProps.user.photoURL !== this.props.user.photoURL){
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

        
        socket.on('statusComment', (data) => {
            let mutator = JSON.parse(JSON.stringify(this.state.userPosts));
            console.log(mutator.filter(i => i._id === data.status_id)[0].post_comments)
            mutator.filter(i => i._id === data.status_id)[0].post_comments.push(data)
            this.setState({
                userPosts: mutator
            })  
        });
    }

    componentDidMount(){
      this.subscribeEvents();
      this.fetchPost();
    }

    componentWillUnmount(){
        this.requestController.abort();
        socket.off('statusComment');
        socket.off('statusDelete');
    }

    fetchPost = () => {
        fetch(`/status/${this.props.match.params.user_id}`, {
            method: 'GET',
            credentials: 'same-origin',
            signal: this.requestController.signal,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.props.Auth.getToken()
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.code === 401){
                this.props.timeOut(res);
                return;
            }
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