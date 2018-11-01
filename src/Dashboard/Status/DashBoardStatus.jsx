import React from "react";
import openSocket from "socket.io-client";
import InfiniteScroll from "react-infinite-scroll-component";
import DashBoardPostLayout from "./DashBoardPostLayout";
import DashBoardStatusWrapper from "./DashBoardStatusWrapper";

const socket = openSocket("/");

class DashBoardStatus extends React.Component {
  constructor() {
    super();
    this.state = {
      getStatus: [],
      recentUpdates: [],
      more: true
    };
    this.requestController = new AbortController();
  }

  componentDidMount() {
    this.getStatus();
    this.subscribeEvents();
  }

  componentWillUnmount() {
    this.requestController.abort();
    socket.off("statusInit");
    socket.off("statusDelete");
    socket.off("statusComment");
  }

  getStatus = () => {
    const { getStatus } = this.state;
    const { util, timeOut } = this.props;
    util
      .fetch(`/status?page=${getStatus.length}&limit=3`, {
        method: "GET",
        credentials: "same-origin",
        signal: this.requestController.signal
      })
      .then(res => {
        if (res.code === 401) {
          timeOut(res);
          return;
        }

        this.setState({
          getStatus: [...getStatus, ...res.data],
          more: res.data.length !== 0
        });
      })
      .catch(err => console.log(err));
  };

  subscribeEvents = () => {
    const { getStatus } = this.state;
    socket.on("statusDelete", data => {
      console.log(data);
      const state = getStatus;
      const filtered = state.filter(obj => obj._id !== data._id);
      this.setState({
        getStatus: filtered
      });
    });

    socket.on("statusComment", data => {
      const mutator = JSON.parse(JSON.stringify(getStatus));
      mutator.filter(i => i._id === data.status_id)[0].post_comments.push(data);
      this.setState({
        getStatus: mutator
      });
    });

    socket.on("statusInit", data => {
      this.setState(prevState => ({
        recentUpdates: [...prevState.recentUpdates, data],
        getStatus: [data, ...getStatus]
      }));
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
          loader={<DashBoardPostLayout />}
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
