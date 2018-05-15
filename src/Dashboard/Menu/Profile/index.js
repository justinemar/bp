import React from 'react';
import './profile.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';


class MenuProfile extends React.Component{
    
    state = {
       edit: {
           textNode: 'Edit Profile',
           editing: false
       } 
    }
    
    toggleEdit = () => {
        const { edit } = this.state;
        const newState = edit.editing ? 
        { textNode: 'Edit Profile' , editing: false } 
            : 
        { textNode: 'Done Edit' , editing: true };
        
        this.setState({
            edit: {
                textNode: newState.textNode,
                editing: newState.editing
            }
        })
    }
    
    uploadImage = () => {
         
    }
    
    render(){
        const { edit } = this.state;
        const { user } = this.props;
        return (
            <div className="section-selected-tab">
                <div className="profile-head-wrapper">
                    <div className="profile-cover">
                    </div>
                    <div className="profile-photo">
                        <div className="profile-user-image" style={{backgroundImage: `url(${user.photoURL})`}}>
                        { edit.editing ?
                             <div>
                                <label htmlFor="change-image-btn">
                                    <FontAwesomeIcon className="profile-image" icon="image"/> 
                                </label>
                                <button id="change-image-btn" className="opt-none" onClick={this.uploadImage}></button>
                            </div> : null
                        }
                        </div>
                        <div className="profile-name">
                            <div className="profile-user-info">
                                <h1>{user.displayName}</h1>
                                <span id="title">The chosen one</span>
                            </div>
                            <div className="profile-user-stats">
                            <ul>
                                <li><span className="stats-color">200</span> Followers</li>
                                <li><span className="stats-color">3</span> Following</li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    <div className="profile-control">
                            <button> View as </button>
                            <button onClick={this.toggleEdit}>{edit.textNode}</button>
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