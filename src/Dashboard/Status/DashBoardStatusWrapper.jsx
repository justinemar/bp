/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import openSocket from 'socket.io-client';

const socket = openSocket('/');

const DeleteConfirmModal = ({
  modalVisible,
  toggleModal,
  initDelete,
  data,
}) => {
  const renderModal = modalVisible ? (
    <div className="modal-wrapper">
      <h3> You sure you want to do this? </h3>
      <div className="modal-opt">
        <div className="modal-delete-btn">
          <button type="button" onClick={() => initDelete(data)}>
            Delete
          </button>
        </div>
        <div className="modal-cancel-btn">
          <button type="button" onClick={toggleModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return renderModal;
};

const PostControl = ({
  isVisible,
  currentStatus,
  util,
  toggleModal,
  ...props
}) => (
  <div>
    {isVisible ? (
      <div className="control-btn">
        <button
          type="button"
          onClick={() => props.handleStatusTab(currentStatus)}
        >
            Open in tab
        </button>
        {currentStatus.post_by._id === util.getProfile().id ? (
          <button type="button" onClick={toggleModal}>Delete</button>
          ) : null}
        <button type="button">Report</button>
      </div>
      ) : null}
  </div>
  );

const PostImage = ({ currentStatus }) => {
  let displayImg;
  const imageArray = currentStatus;
  if (imageArray.post_img.imageArray.length === 1) {
    displayImg = (
      <div
        className="post-image"
        style={{ backgroundImage: `url(${imageArray.post_img.imageArray[0]})` }}
      />
    );
  } else {
    displayImg = imageArray.post_img.imageArray.slice(0, 4).map((i, index) => {
      if (index === 3) {
        return (
          <div className="post-image-more">
            <Link
              to={`/${currentStatus.post_by._id}/status/${currentStatus._id}`}
            >
              <h4> Show more </h4>
            </Link>
          </div>
        );
      }
      return (
        <div
          className="post-image-small"
          style={{ backgroundImage: `url(${i})` }}
        />
      );
    });
  }

  return displayImg;
};

const PostComments = ({ currentStatus, location }) => (currentStatus.post_comments !== undefined
    ? currentStatus.post_comments.map((i) => {
      const splitUrl = location.pathname.split('/');
      splitUrl.splice(-1, 2, i.comment_from._id);
      return (
        <div className="main-comment-wrapper">
          <div className="post-comment">
            <Link replace to={splitUrl.join('/')}>
              <div
                className="comment-user-image"
                style={{
                  backgroundImage: `url(${i.comment_from.photo_url})`,
                }}
              />
            </Link>
            <div className="post-comment-info">
              <span id="comment-date">
                {moment(i.comment_posted).fromNow()}
              </span>
              <span id="comment-from">{i.comment_from.display_name}</span>
              <p>{i.comment_text}</p>
            </div>
          </div>
        </div>
      );
    })
    : null);

class DashBoardStatusWrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      commentVal: '',
      postControlVisible: false,
      controlModalVisible: false,
    };
  }

  handKeyDown = (e) => {
    const { commentVal } = this.state;
    const {
 user, cStatus, util, timeOut,
} = this.props;
    const el = e.target;
    // Expand comment box via
    if (e.shiftKey && e.keyCode === 13) {
      setTimeout(() => {
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = `height:${el.scrollHeight}px`;
      }, 0);
    } else if (e.keyCode === 13) {
      e.preventDefault();

      if (commentVal.length <= 0 || commentVal.match(/^\s*$/g)) {
        return;
      }

      fetch('/comment', {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({
          id: user.id,
          comment: commentVal,
          post_id: cStatus._id,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${util.getToken()}`,
        },
      })
        .then(res => res.json())
        .then((res) => {
          if (res.code === 401) {
            timeOut(res);
            return;
          }
          const getComment = res.data.post_comments[res.data.post_comments.length - 1];
          getComment._id = res.data._id;
          socket.emit('statusComment', getComment);
        })
        .catch(err => console.log(err));
    }

    // Hitting word breakpoint
    setTimeout(() => {
      el.style.cssText = 'height:auto; padding:0';
      el.style.cssText = `height:${el.scrollHeight}px`;
    }, 0);
  };

  handleOnChange = (e) => {
    this.setState({
      commentVal: e.target.value,
    });
  };

  toggleModal = () => {
    const { controlModalVisible } = this.state;
    this.setState({
      controlModalVisible: !controlModalVisible,
    });
  };

  togglePostControl = () => {
    const { postControlVisible } = this.state;
    this.setState({
      postControlVisible: !postControlVisible,
    });
  };

  handleStatusTab = (status) => {
    const { history } = this.props;
    history.push(`/${status.post_by._id}/post/${status._id}`);
  };

  handleDelete = (data) => {
    const { util, timeOut } = this.props;
    // Instead of getting the id from the user props
    // we get the actual id stored in the token.
    const userID = util.getProfile.id;
    const statusID = data._id;
    fetch(`/post/${statusID}`, {
      method: 'Delete',
      credentials: 'same-origin',
      body: JSON.stringify({ userID, statusID }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${util.getToken()}`,
      },
    })
      .then(res => res.json())
      .then((res) => {
        if (res.code === 401) {
          timeOut(res);
          return;
        }

        socket.emit('statusDelete', res.data);
        this.toggleModal();
        this.togglePostControl();
      })
      .catch(err => console.log(err));
  };

  render() {
    const { postControlVisible, controlModalVisible, commentVal } = this.state;
    const {
 cStatus, util, user, location,
} = this.props;
    const splitUrl = location.pathname.split('/');
    splitUrl.splice(-1, 2, cStatus.post_by._id);
    return (
      <div>
        <DeleteConfirmModal
          toggleModal={this.toggleModal}
          initDelete={this.handleDelete}
          modalVisible={controlModalVisible}
          data={cStatus}
        />
        <div className="dashboard-post scale-up-center">
          <div className="post-from-detail">
            <div className="post-control">
              <label htmlFor={cStatus._id}>
                <input
                  type="button"
                  id={cStatus._id}
                  className="opt-none"
                  onClick={this.togglePostControl}
                />
                <FontAwesomeIcon className="post-icon" icon="ellipsis-h" />
              </label>
              <PostControl
                isVisible={postControlVisible}
                currentStatus={cStatus}
                util={util}
                handleStatusTab={this.handleStatusTab}
                toggleModal={this.toggleModal}
              />
            </div>
            <div className="post-from-profile-con left">
              <Link to={splitUrl.join('/')}>
                <div
                  id="post-from-image"
                  style={{
                    backgroundImage: `url(${cStatus.post_by.photo_url})`,
                  }}
                />
              </Link>
            </div>
            <div className="post-info right">
              <span id="post-from">
                {cStatus.display_name || cStatus.post_by.display_name}
              </span>
              <span id="post-age">{moment(cStatus.post_date).fromNow()}</span>
            </div>
          </div>
          <div className="clear-both" />
          <div className="post-details">
            <div className="post-image-wrapper">
              {cStatus.post_img && cStatus.post_img.imageArray !== undefined ? (
                <PostImage currentStatus={cStatus} />
              ) : null}
            </div>
            <div className="post-status-wrapper">
              <p>
                {' '}
                {cStatus.post_description}
                {' '}
              </p>
            </div>
            <div className="post-reactions-wrapper">
              <div className="reactions-head">
                <span id="post-tag"> League </span>
                <span className="right" id="post-init-react">


                  React
                </span>
              </div>
              <div className="reactions-list">
                <div className="a-reaction" />
                <div className="a-reaction" />
              </div>
            </div>
            <div className="post-commentBox-wrapper">
              <PostComments currentStatus={cStatus} location={location} />
              <div className="post-comment-box">
                <div
                  className="user-image"
                  style={{ backgroundImage: `url(${user.photoURL})` }}
                />
                <textarea
                  onChange={this.handleOnChange}
                  onKeyDown={this.handKeyDown}
                  className="main-comment-box"
                  type="text"
                  placeholder="Say something about this human..."
                  ref={(text) => {
                    this.commentVal = text;
                  }}
                  value={commentVal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashBoardStatusWrapper;
