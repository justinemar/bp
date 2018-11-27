/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import openSocket from 'socket.io-client';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoungePlaceHolder from '../../LoadingPlaceholders/LoungePlaceHolder';
import PostForm from '../../../Shared/PostForm';
import AuthService from '../../../utils/authService';
import ReturnArrow from '../../../Shared/ReturnArrow';
import Spinner from '../../../Shared/Spinner';

const socket = openSocket('/');

class GroupLounge extends React.Component {
    constructor() {
      super();
      this.state = {
        loungeData: null,
        ImagesData: [],
        loading: false,
        groupPosts: [],
        more: true,
      };
      this.Auth = new AuthService();
      this.requestController = new AbortController();
    }

    componentDidMount() {
      this.getGroup();
    }

    getGroup = () => {
      const { match: { params } } = this.props;
      const { loungeData } = this.state;

      const groupName = params.group.replace('@', '');
      fetch(`/groups/${groupName}`, {
        method: 'GET',
        credentials: 'same-origin',
      })
      .then(res => res.json())
      .then((res) => {
        this.setState({
          loungeData: res[0],
        }, () => this.subscribeEvents());

        if (loungeData !== null) return res;
      })
      .then(() => {
        this.getPosts();
      });
    }

    getPosts = () => {
      const { groupPosts, loungeData } = this.state;
      const { Auth, timeOut } = this.props;

       Auth.fetch(`/groups/${loungeData._id}/wall?page=${groupPosts.length}&limit=4`, {
          method: 'GET',
          credentials: 'same-origin',
          signal: this.requestController.signal,
        })
        .then((res) => {
          if (res.code === 401) {
            timeOut(res);
            return;
          }

          this.setState({
            groupPosts: [...groupPosts, ...res.data],
          });
        })
        .catch(err => console.log(err));
    }

    subscribeEvents = () => {
      const { loungeData } = this.state;
      const filtered = { ...loungeData };

      socket.on('userConnected', (user) => {
          filtered.members[filtered.members.findIndex(member => member.identity._id === user.identity._id)].identity = user.identity;
          this.setState(
            prevState => ({
                loungeData: { ...prevState.loungeData, ...filtered },
            }),
          );
      });

      socket.on('userDisconnected', (user) => {
          filtered.members[filtered.members.findIndex(member => member.identity._id === user.identity._id)].identity = user.identity;
          this.setState(
            prevState => ({
                loungeData: { ...prevState.loungeData, ...filtered },
            }),
          );
      });
    }

    submitPost = (e) => {
      e.preventDefault();
      const { ImagesData, loungeData } = this.state;
      const { timeOut } = this.props;
      this.setState({
        loading: true,
      });
      const formData = new FormData();
      formData.append('description', this.status.value);
      formData.append('id', this.Auth.getProfile().id);
      ImagesData.forEach((i) => {
          formData.append('image', i);
      });
      this.Auth.fetch(`/groups/${loungeData._id}/wall`, {
          method: 'POST',
          credentials: 'same-origin',
          body: formData,
          signal: this.requestController.signal,
      })
          .then((res) => {
              if (res.code === 401) {
                  return timeOut(res);
              }
              this.setState({
                loading: false,
              });
          })
          .catch(err => console.log(err));
    }

    addImageData = () => {
      const fileList = Array.from(this.imageUpload.files);
      console.log(fileList);
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
      const {
 loungeData, loading, groupPosts, more,
} = this.state;
      const { user, history } = this.props;
      const members = loungeData && loungeData !== null ? loungeData.members.map(member => (
        <div className="user-info slide-in-fwd-center">
          <div className={member.identity.online ? 'user-status-online' : 'user-status-offline'}>
            <Link to={`/dashboard/${member.identity._id}`} replace>
              <div className="user-icon" style={{ backgroundImage: `url(${member.identity.photo_url})` }} />
            </Link>
          </div>
          <span className="user-name">{member.identity.display_name}
            {member.role === 'Owner'
            ? (
              <label htmlFor="owner" className="tooltip">
                <FontAwesomeIcon className="owner-crown" icon="crown" />
                <span className="tooltiptext" id="owner">Group Owner</span>
              </label>
              ) : null}
          </span>
        </div>
      )) : <LoungePlaceHolder />;
      const loungeActive = loungeData && loungeData !== null ? (
        <div className="group-lounge">
          <div className="group-lounge-info">
            <ReturnArrow history={history} />
            <div className="group-lounge-logo">
              <div className="logo" style={{ backgroundImage: `url(${loungeData.logo})` }} />
              <h1>{loungeData.name}</h1>
            </div>
            <div className="group-users">
              <div className="group-members">
                <h2>MEMBERS</h2>
                {members}
              </div>
            </div>
          </div>
          <div className="group-wall" id="scrollable">
            {/* undecided contents */}
            <PostForm
              loading={loading}
              user={user}
              status={i => this.status = i}
              imageUpload={i => this.imageUpload = i}
              submitPost={this.submitPost}
              removeImageData={this.removeImageData}
              addImageData={this.addImageData}
            />
            <div className="group-posts">
              <InfiniteScroll
                dataLength={groupPosts.length}
                next={this.getPosts}
                hasMore={more}
                loader={<Spinner fetchInProgress={more} defaultRender="End of Results" />}
                scrollableTarget="scrollable"
              >
                {groupPosts.map(post => (
                  <GroupPosts post={post} />
                ))}
              </InfiniteScroll>
            </div>
          </div>
        </div>
) : <LoungePlaceHolder />;
        return (
          <div className="section-selected-tab">
            {loungeActive}
          </div>
        );
    }
}


const GroupPosts = ({ post }) => (
  <div className="group-post scale-up-center group-pinned">
    <div className="user-icon" style={{ backgroundImage: `url(${post.post_by.photo_url})` }} />
    <div className="group-post-details">
      <h3>{post.post_by.display_name}</h3>
      <span className="light">PINNED POST</span>
    </div>
    <div className="group-post-content">
      <span>{post.post_description}</span>
      <span className="light" id="timestamp">15 minutes ago</span>
    </div>
  </div>
  );

export default GroupLounge;
