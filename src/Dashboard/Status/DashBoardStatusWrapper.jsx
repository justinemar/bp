import React from 'react';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import openSocket from 'socket.io-client';
const socket = openSocket('/');



const DeleteConfirmModal = ({modalVisible, toggleModal, initDelete, data}) => {
    const renderModal = modalVisible ?
        <div className="modal-wrapper">
            <h3> You sure you want to do this? </h3>
            <div className="modal-opt">
                <div className="modal-delete-btn">
                    <button onClick={() => initDelete(data)}> Delete </button>
                </div>
                <div className="modal-cancel-btn">
                    <button onClick={toggleModal}> Cancel </button>
                </div>
            </div>
        </div>
     : null;
     
     return renderModal;
};

const PostControl = ({isVisible, currentStatus, util, toggleModal, ...props}) => {
    return (
        <div>
            { isVisible ?
                <div className="control-btn">
                    <button onClick={() => props.handleStatusTab(currentStatus)}>Open in tab</button>
                { currentStatus.post_by._id === util.getProfile().id ?
                    <button onClick={toggleModal}>Delete</button> : null 
                }
                    <button>Report</button>
                </div> : null 
            }
        </div>
    );
};


const PostImage = ({currentStatus}) => {
    let displayImg;
    if(currentStatus.post_img.length === 1){
         displayImg = <div className="post-image" style={{backgroundImage: `url(${currentStatus.post_img[0]})`}}></div>  
    } else {
        displayImg = currentStatus.post_img.map((i, index) => {
            if(index > 2){
                return (
                    <div className="post-image-more">
                        <Link to={`/${currentStatus.post_by._id}/status/${currentStatus._id}`}><h4> Show more </h4></Link>
                    </div>
                );
            }
            
            return (
                <div className="post-image-small" style={{backgroundImage: `url(${i})`}}></div>
            );
        })
    }
    
    return displayImg;
}

const PostComments = ({currentStatus}) => 
    currentStatus.post_comments !== undefined ? currentStatus.post_comments.map(i => {
        return (
            <div className="main-comment-wrapper">
                <div className="post-comment">
                    <div className="comment-user-image" style={{backgroundImage: `url(${i.comment_from.photo_url})`}}>
                    </div>
                    <div className="post-comment-info">
                        <span id="comment-date">{moment(i.comment_posted).fromNow()}</span>
                        <span id="comment-from">{i.comment_from.display_name}</span>
                        <p>{i.comment_text}</p>
                    </div>
                </div>
            </div>   
        );
    }) : null;


class DashBoardStatusWrapper extends React.Component{
    
    
    constructor(){
        super();
        this.state = {
            commentVal: '',
            postControlVisible: false,
            controlModalVisible: false
        };
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
        e.preventDefault();
          if(this.state.commentVal.length <= 0 || this.state.commentVal.match(/^\s*$/g)){
              return;
          }
            fetch('/comment', {
                method: 'POST',
                credentials: 'same-origin',
                body: JSON.stringify({id: this.props.user.id, comment: this.state.commentVal, post_id: this.props.cStatus._id}),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.props.util.getToken()
                }
            })
            .then(res => res.json())
            .then(res => {
                if(res.code === 401){
                    this.props.validate(res);
                    return;
                }
            })
            .catch(err => console.log(err));
      }
      
      // For word breakpoint
      setTimeout( () => {
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
      },0);
    }

    handleOnChange = (e) => {
        this.setState({
            commentVal: e.target.value
        })  ;  
    }
    
    toggleModal = () => {
        const state = this.state.controlModalVisible ? false : true;
        this.setState({
            controlModalVisible: state
        });
    }
    
    togglePostControl = () => {
        const newState = this.state.postControlVisible ? false : true;
        this.setState({
            postControlVisible: newState
        });
    }
    
    
    handleStatusTab = (status) => {
        this.props.history.push(`/${status.post_by._id}/status/${status._id}`)
    }
    
    handleDelete = (data) => {
        // Instead of getting the id from the user props 
        // we get the actual id stored in the token.
        const userID = this.props.util.getProfile.id; 
        const statusID = data._id;
        fetch('/status', {
            method: "Delete",
            credentials: 'same-origin',
            body: JSON.stringify({userID, statusID}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.props.util.getToken()
            }
        })
        .then(res => res.json())
        .then(res => {
            this.props.timeOut(res);
            if(res.code === 200) {
                socket.emit('statusDelete', res.data);
                this.toggleModal();
                this.togglePostControl();
            }
        })
        .catch(err => console.log(err));
        
    }
    
    
    render(){
        const { postControlVisible, controlModalVisible } = this.state;
        const { cStatus, util, user } = this.props;
        return (
            <div>
                <DeleteConfirmModal toggleModal={this.toggleModal} 
                initDelete={this.handleDelete} 
                modalVisible={controlModalVisible}
                data={cStatus}
                />
                <div className="dashboard-post">
                    <div className="post-from-detail">
                        <div className="post-control">
                                <label htmlFor={cStatus._id}>
                                    <FontAwesomeIcon className="post-icon" icon="ellipsis-h"/> 
                                </label>
                                <input type="button" id={cStatus._id} className="opt-none"
                                    onClick={this.togglePostControl}/>
                                <PostControl isVisible={postControlVisible} 
                                currentStatus={cStatus} 
                                util={util}
                                handleStatusTab={this.handleStatusTab}
                                toggleModal={this.toggleModal}
                                />
                        </div>
                        <div className="post-from-profile-con left">
                             <Link to={`/${cStatus.post_by._id}`}>
                                <div id="post-from-image" style={{backgroundImage: `url(${cStatus.post_by.photo_url})`}}>
                                
                                </div>
                             </Link>
                        </div>
                        <div className="post-info right">
                            <span id="post-from">{cStatus.display_name || cStatus.post_by.display_name }</span>
                            <span id="post-age">{moment(cStatus.post_date).fromNow()}</span>
                        </div>
                    </div>
                    <div className="clear-both"></div>
                    <div className="post-details">
                        <div className="post-image-wrapper">
                            <PostImage currentStatus={cStatus}/>
                        </div>
                        <div className="post-status-wrapper">
                            <p> {cStatus.post_description} </p>
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
                            <PostComments currentStatus={cStatus}/>
                            <div className="post-comment-box">
                                <div className="user-image" style={{backgroundImage: `url(${user.photoURL})`}}>
                                </div>
                                <textarea onChange={this.handleOnChange} onKeyDown={this.handKeyDown} 
                                    className="main-comment-box" type="text" 
                                    placeholder="Say something about this human..."
                                    ref={(text) => this.commentVal = text}
                                    value={this.state.commentVal}
                                />
                            </div>
                        </div>
                    </div>
                </div>      
            </div>
        );
    }
}


export default DashBoardStatusWrapper;