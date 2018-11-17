import React from 'react';
import openSocket from 'socket.io-client';
import AuthService from '../../utils/authService';
import DashBoardStatus from './DashBoardStatus.jsx';
import PostForm from '../PostForm';

const socket = openSocket('/');


class DashBoardStatusContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ImagesData: [],
        };
        this.Auth = new AuthService();
        this.requestController = new AbortController();
    }

    componentWillUnmount() {
        this.requestController.abort();
    }

    submitPost = (e) => {
        e.preventDefault();
        const { ImagesData } = this.state;
        const { timeOut } = this.props;
        const formData = new FormData();
        formData.append('description', this.status.value);
        formData.append('user', this.Auth.getProfile().displayName);
        formData.append('id', this.Auth.getProfile().id);
        formData.append('user_photo', this.Auth.getProfile().photoURL);
        ImagesData.forEach((i) => {
            formData.append('image', i);
        });
        this.Auth.fetch('/status', {
            method: 'POST',
            credentials: 'same-origin',
            body: formData,
            signal: this.requestController.signal,
        })
            .then((res) => {
                if (res.code === 401) {
                    return timeOut(res);
                }
                socket.emit('statusInit', res.data);
                socket.emit('notification', res.data);
            })
            .catch(err => console.log(err));
    }

    addImageData = () => {
        const fileList = Array.from(this.imageUpload.files);
        this.setState(
            prevState => ({
                ImagesData: [...prevState.ImagesData, ...fileList],
            }),
        );
    }

    removeImageData = (index) => {
        const { ImagesData } = this.state;
        const data = [...ImagesData];
        data.splice(index, 1);
        this.setState({
            ImagesData: data,
        });
    }

    render() {
        const { user, recentUpdates, validate } = this.props;
        return (
          <div className="section-selected-tab" id="scrollable">
            <div className="dashboard-post-status-main">
              <PostForm
                user={user}
                status={i => this.status = i}
                imageUpload={i => this.imageUpload = i}
                submitPost={this.submitPost}
                removeImageData={this.removeImageData}
                addImageData={this.addImageData}
              />
            </div>
            <DashBoardStatus
              util={this.Auth}
              recentUpdates={recentUpdates}
              validate={validate}
              user={user}
              {...this.props}
            />
          </div>

        );
    }
}


export default DashBoardStatusContainer;
