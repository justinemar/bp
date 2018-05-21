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
                    <input ref={inputRef} 
                        name="image" 
                        type="file" 
                        accept="image/*" 
                        id={forId} 
                        className="opt-none" 
                        onChange={func}
                    />
                </div>
            : null }
         </div> 
    );
};

class MenuProfile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            edit: {
               textNode: 'Edit Profile',
               editing: false
            },
            cover: {
                url: props.user.coverURL,
                data: null
            },
            photo: { 
                url: props.user.photoURL,
                data: null
            }
        };
    }

    componentDidMount(){
     
    }
    
    toggleEdit = () => {
        const { edit } = this.state;
        const newState = edit.editing ? 
        { textNode: 'Edit Profile' , editing: false } 
            : 
        { textNode: 'Cancel Edit' , editing: true };
        
        this.setState({
            edit: {
                textNode: newState.textNode,
                editing: newState.editing
            }
        });
    }
    
    setImage = () => {
         const image = URL.createObjectURL(this.photo_ref.files[0]);
         this.setState({
             photo:{
               url: image,
               data: this.photo_ref.files[0]
             } 
         });
    }
    
    setCover = () => {
         const image = URL.createObjectURL(this.cover_ref.files[0]);
         this.setState({
             cover: { 
                 url: image,
                 data: this.cover_ref.files[0]
             }
         });
    }
    
    
    saveUpdate = () => {
        const formData = new FormData();
        const { user, Auth, dataChange } = this.props;
        const newCover = user.coverURL !== this.state.cover.url ? this.state.cover : false;
        const newPhoto = user.photoURL !== this.state.photo.url ? this.state.photo : false;
        formData.append('user_id', user.id);
        formData.append('photo', this.photo_ref.files[0]);
        formData.append('cover', this.cover_ref.files[0]);
    
        Auth.fetch('/update', {
            method: "POST",
            credentials: 'same-origin',
            body: formData,
        })
        .then(res => {
            if(res.code === 200){
                dataChange(res)
            }
        })
        .catch(err => console.log(err));
    }
    
    render(){
        const { edit, cover, photo } = this.state;
        const { user } = this.props;
        return (
            <div className="section-selected-tab">
                <div className="profile-head-wrapper">
                    <div className="profile-cover-image" style={{backgroundImage: `url(${cover.url})`}}>
                        <EditTrigger edit={edit} 
                        forId="change-cover-btn"
                        awesomeClass="profile-cover"
                        textNode="Change your profile cover"
                        func={this.setCover}
                        textClass="change-cover-text"
                        inputRef={i => this.cover_ref = i}/>
                    </div>
                <div className="profile-photo">
                        <div className="profile-user-image" style={{backgroundImage: `url(${photo.url})`}}>
                            <EditTrigger edit={edit} 
                            forId="change-image-btn"
                            awesomeClass="profile-image"
                            textNode="Change your profile photo"
                            func={this.setImage}
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
                            { edit.editing ? 
                            <button onClick={this.saveUpdate}>Save Update</button>
                            : null }
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