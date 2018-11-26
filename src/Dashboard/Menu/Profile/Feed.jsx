import React from 'react';
import openSocket from 'socket.io-client';
import DashBoardStatusWrapper from '../../Status/DashBoardStatusWrapper';
import StatusPlaceHolder from '../../LoadingPlaceholders/StatusPlaceHolder';

const socket = openSocket('/');

class Feed extends React.Component {
    constructor() {
        super();
        this.state = {
            userPosts: null,
        };
    }

    requestController = new AbortController();

    componentDidMount() {
      this.subscribeEvents();
      this.fetchPost();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.user_id !== this.props.match.params.user_id) {
            this.fetchPost();
        } else if (prevProps.user.photoURL !== this.props.user.photoURL) {
            this.fetchPost();
        }
    }

    componentWillUnmount() {
        this.requestController.abort();
        socket.off('statusComment');
        socket.off('statusDelete');
    }

    fetchPost = () => {
        fetch(`/post/${this.props.match.params.user_id}`, {
            method: 'GET',
            credentials: 'same-origin',
            signal: this.requestController.signal,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.props.Auth.getToken()}`,
            },
        })
        .then(res => res.json())
        .then((res) => {
            if (res.code === 401) {
                this.props.timeOut(res);
                return;
            }
            this.setState({
                userPosts: res.data,
            });
        })
        .catch(err => console.log(err));
    }

    subscribeEvents() {
        socket.on('statusDelete', (data) => {
            this.setState(
                prevState => ({
                    userPosts: prevState.userPosts.filter(obj => obj._id !== data._id),
                }),
              );
        });


        socket.on('statusComment', (data) => {
            const { userPosts } = this.state;
            const statusCopy = JSON.parse(JSON.stringify(userPosts));
            statusCopy.filter(status => status._id === data._id)[0].post_comments.push(data);
            this.setState({
                userPosts: statusCopy,
            });
        });
    }

    render() {
        const { userPosts } = this.state;
        const owned_post = userPosts
            ? userPosts.map((cStatus, index) => (
              <DashBoardStatusWrapper key={cStatus._id} {...this.props} util={this.props.Auth} cStatus={cStatus} user={this.props.user} />
                )) : <StatusPlaceHolder />;
        return (
          <div>
            {owned_post}
          </div>
        );
    }
}


export default Feed;
