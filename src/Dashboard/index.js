import React from 'react';
import openSocket from 'socket.io-client';
import AuthService from '../utils/authService';
import withAuth from '../utils/withAuth';
import './dashboard.css';

const Auth = new AuthService();
const socket = openSocket('/');


class DashBoard extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            commentVal: null
        };
    }
    
    
    handleOnChange = (e) => {
        this.setState({
            commentVal: e.target.value
        })    
    }
    
    handleLogout = () => {
        Auth.logout();
        this.props.history.replace('/');
     }
     
    handKeyDown = (e) => {
      const el = e.target;
      if(e.shiftKey && e.keyCode === 13){
          // For Shift + Enter
          setTimeout(function(){
            el.style.cssText = 'height:auto; padding:0';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
          },0);
      } else if(e.keyCode === 13){
        e.preventDefault()
        
        fetch('/comment', {
            credentials: 'same-origin'
        })
      }
      
      // For word breakpoint
      setTimeout(function(){
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
      },0);
    }
    
    componentDidMount(){
        socket.emit('page_load');    
    }
    
    render(){
        const { commentVal } = this.state;
        return(
            <div className="dashboard-wrapper">
                <header className="dashboard-header">
                    <div className="dashboard-h-items">
                        <div className="dashboard-h-text-wrapper">
                            <h1> PLACEHOLDER </h1>
                            <span> Lorem ipsum </span>
                        </div>
                        <div className="dashboard-h-controls">
                            <div className="dashboard-h-btn-wrapper">
                                <button onClick={this.handleLogout}>Logout</button>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="dashboard-content-tags">
                </div>
                <div className="dashboard-main-content">
                    <div className="dashboard-content-post">
                        <div className="dashboard-post">
                            <div className="post-details">
                                <div className="post-image-wrapper">
                                    <div className="post-image" style={{backgroundImage: `url(https://i.ytimg.com/vi/piNyc1cJM_s/maxresdefault.jpg)`}}></div>
                                </div>
                                <div className="post-status-wrapper">
                                    <p> much pentakill very wow </p>
                                </div>
                                <div className="post-reactions-wrapper">
                                    <div className="reactions-head">
                                        <span id="post-tag"> League </span>
                                        <span className="right" id="post-init-react"> React </span>
                                    </div>
                                    <div className="reactions-list">
                                        <div className="a-reaction"></div>
                                        <div className="a-reaction"></div>
                                    </div>
                                </div>
                                <div className="post-commentBox-wrapper">
                                    <div className="post-comment-box">
                                        <div className="user-image">
                                        </div>
                                        <textarea onChange={this.handleOnChange} onKeyDown={this.handKeyDown} 
                                            className="main-comment-box" type="text" placeholder="Say something about this human..."
                                                value={commentVal}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
}


export default withAuth(DashBoard);