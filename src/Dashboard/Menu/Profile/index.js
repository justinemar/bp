import React from 'react';
import './profile.css';




class MenuProfile extends React.Component{
    render(){
        return (
            <div className="section-selected-tab">
                <div className="profile-head-wrapper">
                    <div className="profile-cover">
                    </div>
                    <div className="profile-photo">
                        <div className="profile-user-image">
                        
                        </div>
                        <div className="profile-name">
                            <div className="profile-user-info">
                                <h1>Kodus</h1>
                                <span id="title">The chosen one</span>
                            </div>
                            <div className="profile-user-stats">
                            <ul>
                                <li>200 Followers</li>
                                <li>3 Following</li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    <div className="profile-control">
                            <button> View as </button>
                            <button> Edit Profile </button>
                    </div>
                    <div className="profile-menu-wrapper">
                        <div className="profile-menu-general">
                            <ul>
                                <li className="profile-active-tab">Feed</li>
                                <li>Images</li>
                                <li>Groups</li>
                                <li>About</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}


export default MenuProfile;