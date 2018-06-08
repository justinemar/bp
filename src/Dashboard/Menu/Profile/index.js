import React from 'react';
import './profile.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import AuthService from '../../../utils/authService';
import Feed from './Feed.jsx';
import Images from './Images.jsx';
import Groups from './Groups.jsx';
import About from './About.jsx';
import { NavLink, Route, Switch } from 'react-router-dom';

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
            profile: {
                photo: { 
                    url: props.user.photoURL,
                    data: null
                },
                cover: {
                    url: props.user.coverURL,
                    data: null
                },
                displayName: props.user.displayName,
                id: props.user.id
            }
        };
       this.authUtil = new AuthService();
    }
    
    static getDerivedStateFromProps(props, state){
      if(props.match.params.user_id !== state.profile.id){
            return {
              profile: {
                    cover: {
                        url: props.user.coverURL,
                        data: null
                    },
                    photo: {
                        url: props.user.photoURL,
                        data: null
                    },
                    displayName: props.user.displayName,
                    id: props.user.id
                }
            }
        }
    }
    
    
    setDataFromClient = () => {
        const { user } = this.props;
        this.setState({
            profile: {
                cover: {
                    url: user.coverURL,
                    data: null
                },
                photo: {
                    url: user.photoURL,
                    data: null
                },
                displayName: user.displayName,
                id: user.id
            }
        })
    }
    
    setDataFromServer = () => {
        fetch(`/users/${this.props.match.params.user_id}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.authUtil.getToken()
            }
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                profile: {
                    cover: {
                        url: res.cover_url
                    },
                    photo: {
                        url: res.photo_url
                    },
                    displayName: res.display_name,
                    id: res._id
                }
            })
        })
        .catch(err => console.log(err))    
    }
    
    componentDidMount(){
        if(this.props.match.params.user_id === this.authUtil.getProfile().id){
            this.setDataFromClient();
            return;
        }

        this.setDataFromServer();
    }
    
    
    toggleEdit = () => {
        const { edit } = this.state;
        const newState = edit.editing ? { textNode: 'Edit Profile' , editing: false } : { textNode: 'Cancel Edit' , editing: true };
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
             profile: {
                ...this.state.profile,
                photo:{
                   url: image,
                   data: this.photo_ref.files[0]
                 }
             }
         });
    }
    
    setCover = () => {
         const image = URL.createObjectURL(this.cover_ref.files[0]);
         this.setState({
             profile: {
                ...this.state.profile,
                cover: { 
                     url: image,
                     data: this.cover_ref.files[0]
                 }
             }
         });
    }
    
    
    saveUpdate = () => {
        const formData = new FormData();
        const { Auth, dataChange } = this.props;
        const { profile } = this.state;
        formData.append('user_id', profile.id);
        formData.append('photo', this.photo_ref.files[0]);
        formData.append('cover', this.cover_ref.files[0]); 
        formData.append('oldCover', profile.cover.url);
        formData.append('oldPhoto', profile.photo.url)
        
        Auth.fetch(`/profile/${profile.id}`, {
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
        const { edit, profile } = this.state;
        return (
            <div className="section-selected-tab">
            {console.log(profile.photo.url)}
                <div className="profile-head-wrapper">
                    <div className="profile-cover-image" style={{backgroundImage: `url(${profile.cover.url})`}}>
                        <EditTrigger edit={edit} 
                        forId="change-cover-btn"
                        awesomeClass="profile-cover"
                        textNode="Change your profile cover"
                        func={this.setCover}
                        textClass="change-cover-text"
                        inputRef={i => this.cover_ref = i}/>
                    </div>
                <div className="profile-photo">
                        <div className="profile-user-image" style={{backgroundImage: `url(${profile.photo.url})`}}>
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
                            <h1>{profile.displayName}</h1>
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
                            { this.props.match.params.user_id !== this.authUtil.getProfile().id ? null :
                            <button onClick={this.toggleEdit}>{edit.textNode}</button>
                            }
                    </div>
                    <div className="profile-menu-wrapper">
                        <div className="profile-menu-general">
                            <ul>
                                <li><NavLink exact activeClassName="profile-active-tab" to={`/dashboard/${profile.id}`}>Feed</NavLink></li>
                                <li><NavLink activeClassName="profile-active-tab" to={`/dashboard/${profile.id}/images`}>Images</NavLink></li>
                                <li><NavLink activeClassName="profile-active-tab" to={`/dashboard/${profile.id}/groups`}>Groups</NavLink></li>
                                <li><NavLink activeClassName="profile-active-tab" to={`/dashboard/${profile.id}/about`}>About</NavLink></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="profile-active-tab-content">
                      <Route exact path="/dashboard/:user_id/" render={() => <Feed Auth={this.props.Auth} {...this.props}/>}/>
                      <Route path="/dashboard/:user_id/images" render={() => <Images/>}/>
                      <Route path="/dashboard/:user_id/groups" render={() => <Groups/>}/>
                      <Route path="/dashboard/:user_id/about"  render={() => <About/>}/>
                </div>
            </div>
            )
    }
}


export default MenuProfile;