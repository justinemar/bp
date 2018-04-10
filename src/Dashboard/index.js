import React from 'react';
import openSocket from 'socket.io-client';
import AuthService from '../utils/authService';
import withAuth from '../utils/withAuth';
import DashBoardNotificaiton from './DashBoardNotification.jsx';
import DashBoardStatus from './DashBoardStatus.jsx';
import './dashboard.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const socket = openSocket('/');


class DashBoard extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            validation: {
                message: null,
                type: null,
                code: null
            },
            commentVal: '',
            previewImages: [],
            previewImagesData: [],
            status: [],
            recentUpdates: []
        };
        this.Auth = new AuthService();
    }
    
    
    handleOnChange = (e) => {
        this.setState({
            commentVal: e.target.value
        })    
    }
    
     handKeyDown = (e) => {
      const el = e.target;
      if(e.shiftKey && e.keyCode === 13){
          // For Shift + Enter
          setTimeout( () => {
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
                this.initLogout();
            } else {
                console.log('success')
            }
        }).catch(err => console.log(err))
      }
      
      // For word breakpoint
      setTimeout( () => {
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
      },0);
    }
    
    initLogout = () => {
           socket.emit('userLogout')
         this.Auth.logout();
         this.props.history.replace('/')
    }
    
    submitPost = (e) => {
        e.preventDefault();
        const imageData = this.state.previewImagesData;
        const formData = new FormData();
        formData.append("description", this.status.value);
        console.log(this.props.user.info)
        formData.append("user", this.props.user.info)
        imageData.forEach(i => {
            formData.append("image", i)
        })
        this.Auth.fetch('/status', {
          method: 'POST',
          credentials: 'same-origin',
          body: formData,
        }).then(res => {
            if(res.code === 401){
                this.setState({
                    validation: {
                        message: res.message,
                        type: res.type,
                        code: res.code
                    }
                })
            } else if(res.code === 200){
                socket.emit('statusInit', res.data)
            }
            
            
        }).catch(err => console.log(err));
    }
    
    previewFile = (input) => {
        const output = this.filePreview;
        let divcopy = this.state.previewImages;
        let imagecopy = this.state.previewImagesData;
        let div = undefined;
        let divStore = [];
        let dataStore = [];
        for (var i = 0, f; f = this.imageUpload.files[i]; i++) {
            const image = URL.createObjectURL(this.imageUpload.files[i]);
            div = <div className="image-preview" style={{backgroundImage: `url(${image})`}}></div>;
            divStore.push(div);
            dataStore.push(f);
        }
        
        this.setState({
            previewImages: divcopy.concat(divStore),
            previewImagesData:  imagecopy.concat(dataStore) 
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
        socket.emit('page_load');
        socket.on('statusInit', (data) => {
          this.setState({
              status: this.state.status.concat(data),
              recentUpdates: this.state.recentUpdates.concat(data)
          })
        });
        
    }
    
    
    settingTab = () => {
        alert(2)
    }
    
    
    render(){
        const { commentVal, previewImages, validation, status, recentUpdates } = this.state;
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
            { validation.code === 401 ? 
                <div className="dashboard-timeout">
                    <div className="dashboard-timeout-content">
                            <h1> Your session has expired, please login to continue where you left off </h1>
                            <button onClick={this.initLogout}> Login to continue </button>
                    </div>
                </div> : null }
                <header className="dashboard-header">
                    <div className="dashboard-h-items">
                        <div className="dashboard-h-text-wrapper">
                            <h1> PLACEHOLDER </h1>
                            <span> Lorem ipsum </span>
                        </div>
                        <div className="dashboard-h-controls">
                            <div className="dashboard-h-btn-wrapper">
                                <button onClick={this.initLogout}>Logout</button>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="dashboard-main-content">
                    <div className="dashboard-menu">
                        <div className="dashboard-controls">
                            <div className="dashboard-tab">
                                <label htmlFor="setting-tab">
                                    <FontAwesomeIcon className="dashboard-icon" icon="ellipsis-h"/> 
                                    <span className="dashboard-tab-name">
                                        Settings
                                    </span>
                                </label>
                                <input type="button" onClick={this.settingTab} id="setting-tab" className="opt-none"/>
                            </div>
                            <div className="dashboard-tab dashboard-active-tab">
                                <FontAwesomeIcon className="dashboard-icon" icon="newspaper"/> 
                                <span className="dashboard-tab-name">
                                    Feed
                                </span>
                            </div>
                        </div>
                    </div>
                    <DashBoardNotificaiton recentUpdates={recentUpdates}/>
                    <div className="dashboard-post-container">
                        <div className="dashboard-post-status-main">
                        <form onSubmit={this.submitPost} method="post">
                            <textarea name="description" ref={(txt) => this.status = txt} id="post-status" placeholder={`You know what this is for, ${user.info}`}>
                            
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
                                        <input name="image" onClick={(event)=> { event.target.value = null }}  
                                            accept="image/*" ref={(input) => this.imageUpload = input} 
                                            onChange={this.previewFile} className="opt-none" id="opt-image-upload" 
                                            type="file" 
                                            multiple
                                        />
                                    </div>
                                    <div className="dashboard-opt">
                                        <label id="gif-upload" htmlFor="opt-gif-upload" className="opt-cta">
                                        <div className="dashboard-icon dashboard-opt-icon">GIF</div>
                                        </label>
                                        <input type="button" className="opt-none" id="opt-gif-upload"/>
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
                                        <input className="opt-none" id="opt-submit" type="submit"/>
                                    </div>
                                </div>
                            </div>
                            </form>
                            </div>
                            <div className="dashboard-content-post">
                                <DashBoardStatus 
                                    handKeyDown={this.handKeyDown} 
                                    handleOnChange={this.handleOnChange}
                                    comment={text => this.commentVal = text}
                                />
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
    
}


export default withAuth(DashBoard);