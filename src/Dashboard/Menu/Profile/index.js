import React from 'react';
import './profile.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const EditTrigger = ({edit, forId, textNode, func, awesomeClass, textClass, inputRef}) => {
    return (
        <div>
            { edit.editing ?
                <div>
                    <label htmlFor={forId}>
                        <FontAwesomeIcon className={awesomeClass} icon="image"/> 
                        <p className={textClass}>{textNode}</p>
                    </label>
                    <input ref={inputRef} type="file" accept="image/*" id={forId} className="opt-none" onChange={func}/>
                </div>
            : null }
         </div> 
    )
}

class MenuProfile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            edit: {
               textNode: 'Edit Profile',
               editing: false
            },
            coverURL: props.user.coverURL,
            photoURL: props.user.photoURL
        };
    }

    componentDidMount(){
     
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
         const image = URL.createObjectURL(this.photo_ref.files[0]);
         this.setState({
             photoURL: image
         })
    }
    
    uploadCover = () => {
         const image = URL.createObjectURL(this.cover_ref.files[0]);
         this.setState({
             coverURL: image
         })
    }
    render(){
        const { edit, coverURL, photoURL } = this.state;
        const { user } = this.props;
        return (
            <div className="section-selected-tab">
                <div className="profile-head-wrapper">
                    <div className="profile-cover-image" style={{backgroundImage: `url(${coverURL})`}}>
                        <EditTrigger edit={edit} 
                        forId="change-cover-btn"
                        awesomeClass="profile-cover"
                        textNode="Change your profile cover"
                        func={this.uploadCover}
                        textClass="change-cover-text"
                        inputRef={i => this.cover_ref = i}/>
                    </div>
                <div className="profile-photo">
                        <div className="profile-user-image" style={{backgroundImage: `url(${photoURL})`}}>
                            <EditTrigger edit={edit} 
                            forId="change-image-btn"
                            awesomeClass="profile-image"
                            textNode="Change your profile photo"
                            func={this.uploadImage}
                            textClass="change-photo-text"
                            inputRef={i => this.photo_ref = i}/>
                        </div>
                    { !edit.editing ?
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
                    </div> : null }
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