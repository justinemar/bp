import React from 'react';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';

const Modal = ({modalVisible, toggleModal, initDelete}) => {
    const renderModal = modalVisible ?
        <div className="modal-wrapper">
            <h3> You sure you want to do this? </h3>
            <div className="modal-opt">
                <div className="modal-delete-btn">
                    <button onClick={initDelete}> Delete </button>
                </div>
                <div className="modal-cancel-btn">
                    <button onClick={toggleModal}> Cancel </button>
                </div>
            </div>
        </div>
     : null
     
     return renderModal;
}

const PostControl = ({isVisible, currentStatus, util, toggleModal}) => {
    return (
        <div>
        { isVisible ?
            <div className="control-btn">
                <button>Open in tab</button>
            { currentStatus.user_id === util.getProfile().id ?
                <button onClick={toggleModal}>Delete</button> : null 
            }
                <button>Report</button>
            </div> : null 
        }
        </div>
        )
}


class DashBoardStatusWrapper extends React.Component{
    
    
    constructor(){
        super()
        this.state = {
            commentVal: '',
            postControlVisible: false,
            controlModalVisible: false
        }
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
          if(this.state.commentVal.length <= 0 || this.state.commentVal.match(/^\s*$/g)){
              return;
          }
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
            })
            .catch(err => console.log(err))
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
        })    
    }
    
    toggleModal = () => {
        const state = this.state.controlModalVisible ? false : true;
        this.setState({
            controlModalVisible: state
        })    
    }
    
    handleDelete = () => {
        alert('delete')
    }
    
    
    postControl = () => {
        const newState = this.state.postControlVisible ? false : true;
        this.setState({
            postControlVisible: newState
        })
    }
    
    render(){
        const { postControlVisible, controlModalVisible } = this.state;
        const { cStatus, user, util } = this.props;
        return (
            <div>
                <div className="dashboard-post">
                <Modal toggleModal={this.toggleModal} initDelete={this.handleDelete} modalVisible={controlModalVisible}/>
                    <div className="post-from-detail">
                        <div className="post-control">
                                <label htmlFor={cStatus._id}>
                                    <FontAwesomeIcon className="post-icon" icon="ellipsis-h"/> 
                                </label>
                                <input type="button" id={cStatus._id} className="opt-none"
                                    onClick={this.postControl}/>
                                <PostControl isVisible={postControlVisible} 
                                currentStatus={cStatus} 
                                util={util}
                                toggleModal={this.toggleModal}
                                />
                        </div>
                        <div className="post-from-profile-con left">
                             <Link to={`/${cStatus.user_id}`}>
                                <div id="post-from-image">
                                
                                </div>
                             </Link>
                        </div>
                        <div className="post-info right">
                            <span id="post-from">{cStatus.post_by}</span>
                            <span id="post-age">{moment(cStatus.post_date).fromNow()}</span>
                        </div>
                    </div>
                    <div className="clear-both"></div>
                    <div className="post-details">
                        <div className="post-image-wrapper">
                        { cStatus.post_img.length === 1 ?
                            <div className="post-image" style={{backgroundImage: `url(${cStatus.post_img[0]})`}}></div>  
                                :
                            cStatus.post_img.map((i, index) => {
                                if(index > 2){
                                    return (
                                        <div className="post-image-more">
                                            <h4> Show more </h4>
                                        </div>
                                    )
                                }
                                return (
                                    <div className="post-image-small" style={{backgroundImage: `url(${i})`}}></div>
                                )
                            })
                        }
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
                            <div className="post-comment-box">
                                <div className="user-image">
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
        )
    }
}


export default DashBoardStatusWrapper;