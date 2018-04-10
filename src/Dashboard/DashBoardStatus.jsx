import React from 'react';



class DashBoardStatus extends React.Component{
    render(){
        const { commentVal, handleOnChange, handKeyDown, comment } = this.props;
        return (
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
                            <textarea onChange={handleOnChange} onKeyDown={handKeyDown} 
                                className="main-comment-box" type="text" 
                                placeholder="Say something about this human..."
                                ref={comment}
                                value={commentVal}
                            />
                        </div>
                    </div>
                </div>
            </div>  
        )
    }
}


export default DashBoardStatus;