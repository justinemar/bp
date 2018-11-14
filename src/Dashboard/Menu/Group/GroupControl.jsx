/* eslint-disable react/jsx-one-expression-per-line */

import React from 'react';


function MemberButton({ callToAction, goLounge }) {
    return (
      <React.Fragment>
        <button type="button" className="panel-btn admin-btn" onClick={() => goLounge()}>
        LOUNGE
        </button>
        <button type="button" className="panel-btn leave-btn" onClick={() => callToAction()}>
        LEAVE GROUP
        </button>
      </React.Fragment>
    );
  }


  function JoinGroup({ callToAction }) {
    return (
      <button type="button" className="panel-btn join-btn" onClick={() => callToAction()}>
        JOIN GROUP
      </button>
    );
  }

  class GroupControl extends React.Component {
    leaveGroup = () => {
      const { user, group } = this.props;
      fetch(`/groups/members/${user.id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          gid: group._id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
            location.reload();
        }
      })
      .catch(err => console.log(err));
    }

    joinGroup = () => {
      const { user, group } = this.props;
      fetch(`/groups/members/${user.id}`, {
        method: 'POST',
        body: JSON.stringify({
          gid: group._id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
            location.reload();
        }
      })
      .catch(err => console.log(err));
    }

    groupLounge = () => {
      const { history, match, group } = this.props;
      history.push(`${match.url}/@${group.name}`);
    }

    render() {
      const { group, user } = this.props;
      let button;
      if (group.owner._id === user.id || group.members.filter(member => member._id === user.id).length > 0) {
            button = <MemberButton goLounge={this.groupLounge} callToAction={this.leaveGroup} />;
      } else {
            button = <JoinGroup callToAction={this.joinGroup} />;
      }
      return (
        <React.Fragment>
          {button}
        </React.Fragment>
      );
    }
  }


  export default GroupControl;
