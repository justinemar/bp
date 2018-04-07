import React from 'react';
import openSocket from 'socket.io-client';
import AuthService from '../utils/authService';
import withAuth from '../utils/withAuth';
import './dashboard.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const Auth = new AuthService();
// const socket = openSocket('/');


class DashBoard extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            commentVal: '',
            previewImages: []
        };
        this.Auth = new AuthService();
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
        this.Auth.fetch('/comment', {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify({comment: this.state.commentVal})
        })
          .then(res => {
            if(res.message['message'] === 'invalid token'){
                this.Auth.logout();
                this.props.history.replace('/')
            } else {
                console.log('success')
            }
        }).catch(err => console.log(err))
      }
      
      // For word breakpoint
      setTimeout(function(){
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
      },0);
    }
    
    
    
    submitPost = () => {
        alert('1')
    }
    
    previewFile = (input) => {
        const output = this.filePreview;
        const image = URL.createObjectURL(this.imageUpload.files[0]);
        const div = <div className="image-preview" style={{backgroundImage: `url(${image})`}}></div>;
        const copy = this.state.previewImages;
        this.setState({
            previewImages: copy.concat(div)
        })
            
    }
    
    removePreview = (index) => {
       const copy = this.state.previewImages;
       const newState = copy.splice(index, 1);
       this.setState({
           previewImages: copy
       })
    }
    
    
    effectPreview = (e) => {
        if(e.type === 'mouseover') {
            e.currentTarget.classList = 'file-preview-hover'
        } else {
            e.currentTarget.classList = '';
        }
    }
    
    componentDidMount(){
        // socket.emit('page_load');
        console.log(this.state.previewImages && this.state.previewImages.length === 0)
    }
    
    render(){
        const { commentVal, previewImages } = this.state;
        const { user } = this.props;
        const imageListPreview = previewImages && previewImages.length !== 0 ? previewImages : null;
        const renderList = imageListPreview ? imageListPreview.map((i, index) => {
            return (
                    <li onMouseLeave={this.effectPreview} onMouseOver={this.effectPreview} onClick={() => this.removePreview(index)} key={index}>
                       {i}
                    </li>
                )
        }) : null;
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
                <div className="dashboard-main-content">
                    <div className="dashboard-menu">
                        <div className="dashboard-controls">
                            <div className="dashboard-tab">
                                <FontAwesomeIcon className="dashboard-icon" icon="ellipsis-h"/> 
                                <span className="dashboard-tab-name">
                                    Settings
                                </span>
                            </div>
                            <div className="dashboard-tab dashboard-active-tab">
                                <FontAwesomeIcon className="dashboard-icon" icon="newspaper"/> 
                                <span className="dashboard-tab-name">
                                    Feed
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-notification">
                        <div className="dashboard-notification-main">
                        
                        </div>
                    </div>
                    <div className="dashboard-post-container">
                        <div className="dashboard-post-status-main">
                            <textarea id="post-status" placeholder={`You know what this is for, ${user.email}`}>
                            
                            </textarea>
                            { renderList ? 
                            <div ref={(div) => this.filePreview = div} className="file-preview">
                                <ul>
                                    {renderList}
                                </ul>
                            </div> : null }
                            <div className="dashboard-post-status-opt">
                                <div className="dashboard-opt-left">
                                    <div className="dashboard-opt">
                                        <label htmlFor="opt-image-upload" className="opt-cta">
                                        <FontAwesomeIcon className="dashboard-icon dashboard-opt-icon" icon="image"/>
                                        </label>
                                        <input ref={(input) => this.imageUpload = input} onChange={this.previewFile} className="opt-none" id="opt-image-upload" type="file"/>
                                    </div>
                                    <div className="dashboard-opt">
                                        <label htmlFor="opt-gif-upload" className="opt-cta">
                                        <div className="dashboard-icon dashboard-opt-icon"></div>
                                        </label>
                                        <span className="opt-none" id="opt-gif-upload"></span>
                                    </div>
                                </div>
                                <div className="dashboard-opt-right">
                                    <div className="dashboard-opt">
                                        <label htmlFor="opt-twitter" className="opt-cta">
                                          <FontAwesomeIcon className="dashboard-icon dashboard-opt-icon" icon={["fab", "twitter"]}/>
                                        </label>
                                        <input className="opt-none" id="opt-twitter" type="button"/>
                                    </div>
                                    <div className="dashboard-opt">
                                        <label htmlFor="opt-submit" className="opt-cta">
                                          <div id="opt-share" className="dashboard-icon dashboard-opt-icon">Share</div>
                                        </label>
                                        <input onClick={this.submitPost} className="opt-none" id="opt-submit" type="button"/>
                                    </div>
                                </div>
                            </div>
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
                </div>
            </div>
        )
    }
    
}


export default withAuth(DashBoard);