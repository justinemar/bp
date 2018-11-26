/* eslint-disable func-names */
import React from 'react';
import openSocket from 'socket.io-client';
import InfiniteScroll from 'react-infinite-scroll-component';
import StatusPlaceHolder from '../LoadingPlaceholders/StatusPlaceHolder';
import DashBoardStatusWrapper from './DashBoardStatusWrapper';

const socket = openSocket('/');

class DashBoardStatus extends React.Component {
  constructor() {
    super();
    this.state = {
      getStatus: [],
      more: true,
    };
    this.requestController = new AbortController();
  }

  componentDidMount() {
    this.getStatus();
    socket.on('statusDelete', (data) => {
      this.setState(
        prevState => ({
          getStatus: prevState.getStatus.filter(obj => obj._id !== data._id),
        }),
      );
    });

    socket.on('statusInit', (data) => {
      this.setState(prevState => ({
        getStatus: [data, ...prevState.getStatus],
      }));
    });
  }

  componentWillUnmount() {
    this.requestController.abort();
    socket.off('statusInit');
    socket.off('statusDelete');
    socket.off('statusComment');
  }

  getStatus = () => {
    const { getStatus } = this.state;
    const { util, timeOut } = this.props;
    util
      .fetch(`/post?page=${getStatus.length}&limit=3`, {
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
          getStatus: [...getStatus, ...res.data],
          more: res.data.length !== 0,
        }, () => this.subscribeEvents());
      })
      .catch(err => console.log(err));
  };

  subscribeEvents = () => {
    socket.on('statusComment', (data) => {
      const { getStatus } = this.state;
      const statusCopy = JSON.parse(JSON.stringify(getStatus));
      statusCopy.filter(status => status._id === data._id)[0].post_comments.push(data);
      this.setState({
        getStatus: statusCopy,
      });
    });
  };

  render() {
    const { getStatus, more } = this.state;
    const { util, validate, user } = this.props;
    return (
      <div className="dashboard-content-post">
        <InfiniteScroll
          dataLength={getStatus.length}
          next={this.getStatus}
          hasMore={more}
          loader={<StatusPlaceHolder />}
          scrollableTarget="scrollable"
        >
          {getStatus.map(cStatus => (
            <DashBoardStatusWrapper
              key={cStatus._id}
              {...this.props}
              validate={validate}
              util={util}
              cStatus={cStatus}
              user={user}
            />
          ))}
        </InfiniteScroll>
      </div>
    );
  }
}

export default DashBoardStatus;
