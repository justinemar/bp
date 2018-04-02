import React from 'react';
import AuthService from '../utils/authService';
import withAuth from '../utils/withAuth';
const Auth = new AuthService();
import './dashboard.css';



class DashBoard extends React.Component{
    
    
    handleLogout = () => {
        Auth.logout()
        this.props.history.replace('/');
     }
     
    render(){
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
                                        <div className="divider"></div>
                                        <div contentEditable="true" className="main-comment-box">
                                            Say something about this human...
                                        </div>
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