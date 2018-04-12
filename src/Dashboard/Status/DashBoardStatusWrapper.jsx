import React from 'react';
import moment from 'moment';






class DashBoardStatusWrapper extends React.Component{
    
    
    
    state = {
        commentVal: ''
    }
    
    
    
    // static getDerivedStateFromProps(nextProps, currState){
        
    // }
    
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
    
    render(){
        const { cStatus } = this.props;
        return (
            <div>
                <div className="dashboard-post">
                    <div className="post-from-detail">
                        <div className="post-from-profile-con left">
                            <div id="post-from-image">
                            
                            </div>
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
                                console.log(index)
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
                                    value={this.commentVal}
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