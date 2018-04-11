import React from 'react';
import './layoutstatus.css';




const DashBoardPostLayout = () => {
    return (
        <div className="layout-dashboard-post">
                    <div className="layout-post-details">
                        <div className="layout-post-image-wrapper">
                            <div className="layout-post-image"></div>  
                        </div>
                        <div className="layout-post-status-wrapper">
                            <p id="p1"></p>
                            <p id="p2"></p>
                            <p id="p3"></p>
                        </div>
                        <div className="layout-post-reactions-wrapper">
                            <div className="layout-reactions-head">
                                <span id="layout-post-tag"> </span>
                                <span className="right"> </span>
                            </div>
                            <div className="layout-reactions-list">
                                <div className="layout-a-reaction"></div>
                                <div className="layout-a-reaction"></div>
                            </div>
                        </div>
                        <div className="layout-post-commentBox-wrapper">
                            <div className="layout-post-comment-box">
                                <div className="layout-user-image">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
        
        )
}


export default DashBoardPostLayout;