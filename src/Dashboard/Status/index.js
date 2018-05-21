import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import AuthService from '../../utils/authService';
import DashBoardStatus from './DashBoardStatus.jsx';
import openSocket from 'socket.io-client';
const socket = openSocket('/');


class DashBoardStatusContainer extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            previewImages: [],
            previewImagesData: [],
        };
        this.Auth = new AuthService();
    }
    
    
    submitPost = (e) => {
        e.preventDefault();
        const imageData = this.state.previewImagesData;
        const formData = new FormData();
        formData.append("description", this.status.value);
        formData.append("user", this.Auth.getProfile().displayName);
        formData.append("id", this.Auth.getProfile().id);
        formData.append("user_photo", this.Auth.getProfile().photoURL);
        imageData.forEach(i => {
            formData.append("image", i);
        });
        this.Auth.fetch('/status', {
          method: 'POST',
          credentials: 'same-origin',
          body: formData,
        })
        .then(res => {
            if(res.code === 401){
                this.props.timeOut(res);
                return;
            }
            socket.emit('statusInit', res.data);
        })
        .catch(err => console.log(err));
    }
    
    previewFile = (input) => {
        const output = this.filePreview;
        let divcopy = this.state.previewImages;
        let imagecopy = this.state.previewImagesData;
        let div;
        let divStore = [];
        let dataStore = [];
        for (var i = 0, f; f = this.imageUpload.files[i]; i++) {
            const image = URL.createObjectURL(this.imageUpload.files[i]);
            div = <div className="image-preview" style={{backgroundImage: `url(${image})`}}></div>;
            divStore.push(div);
            dataStore.push(f);
        }
        
        this.setState({
            previewImages: divcopy.concat(divStore),
            previewImagesData:  imagecopy.concat(dataStore) 
        });
    }
    
    removePreview = (index) => {
       const copyImage = this.state.previewImages;
       const copyData = this.state.previewImagesData;
       copyImage.splice(index, 1);
       copyData.splice(index, 1);
       this.setState({
           previewImages: copyImage,
           previewImagesData: copyData
       });
    }
    
    
    effectPreview = (e) => {
        if(e.type === 'mouseover') {
            e.currentTarget.classList = 'file-preview-hover';
        } else {
            e.currentTarget.classList = '';
        }
    }
    
    
    render(){
        const { previewImages } = this.state;
        const { user, recentUpdates } = this.props;
        const imageListPreview = previewImages && previewImages.length !== 0 ? previewImages : null;
        const renderList = imageListPreview ? imageListPreview.map((i, index) => {
            return (
                    <li onMouseLeave={this.effectPreview} onMouseOver={this.effectPreview} onClick={() => this.removePreview(index)} key={index}>
                       {i}
                    </li>
                );
        }) : null;
        return (
            <div className="section-selected-tab">
                <div className="dashboard-post-status-main">
                    <form onSubmit={this.submitPost} method="post">
                        <textarea name="description" ref={(txt) => this.status = txt} id="post-status" placeholder={`You know what this is for, ${user.displayName}`}>
                        
                        </textarea>
                        { renderList ? 
                        <div ref={(div) => this.filePreview = div} className="file-preview">
                            <ul>
                                {renderList}
                            </ul>
                        </div> : null }
                        <div className="dashboard-post-status-opt">
                            <div className="dashboard-opt-left">
                                <div className="dashboard-opt">
                                    <label htmlFor="opt-image-upload" className="opt-cta">
                                    <FontAwesomeIcon className="dashboard-icon dashboard-opt-icon" icon="image"/>
                                    </label>
                                    <input name="image" onClick={(event)=> { event.target.value = null }}  
                                        accept="image/*" ref={(input) => this.imageUpload = input} 
                                        onChange={this.previewFile} className="opt-none" id="opt-image-upload" 
                                        type="file" 
                                        multiple
                                    />
                                </div>
                                <div className="dashboard-opt">
                                    <label id="gif-upload" htmlFor="opt-gif-upload" className="opt-cta">
                                    <div className="dashboard-icon dashboard-opt-icon">GIF</div>
                                    </label>
                                    <input type="button" className="opt-none" id="opt-gif-upload"/>
                                </div>
                            </div>
                            <div className="dashboard-opt-right">
                                <div className="dashboard-opt">
                                    <label htmlFor="opt-twitter" className="opt-cta">
                                      <FontAwesomeIcon className="dashboard-icon dashboard-opt-icon" icon={["fab", "twitter"]}/>
                                    </label>
                                    <input className="opt-none" id="opt-twitter" type="button"/>
                                </div>
                                <div className="dashboard-opt">
                                    <label htmlFor="opt-submit" className="opt-cta">
                                      <div id="opt-share" className="dashboard-icon dashboard-opt-icon">Share</div>
                                    </label>
                                    <input className="opt-none" id="opt-submit" type="submit"/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="dashboard-content-post">
                <DashBoardStatus
                    util={this.Auth}
                    recentUpdates={recentUpdates}
                    validate={this.props.validate}
                    user={this.props.user} {...this.props}/>
                </div>
            </div>
            
            )
    }
}


export default DashBoardStatusContainer;