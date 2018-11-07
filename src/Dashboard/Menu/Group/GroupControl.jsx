/* eslint-disable react/jsx-one-expression-per-line */

import React from 'react';


function AdminButton({ callToAction }) {
    return (
      <button type="button" className="panel-btn admin-btn" onClick={() => callToAction()}>
        ADMIN
      </button>
    );
  }

  function LeaveGroup({ callToAction }) {
    return (
      <button type="button" className="panel-btn leave-btn" onClick={() => callToAction()}>
        LEAVE GROUP
      </button>
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


    render() {
      const { group, user } = this.props;
      let button;
      if (group.owner._id === user.id) {
            button = <AdminButton callToAction={this.joinGroup} />;
      } else if (group.members.filter(member => member._id === user.id).length > 0) {
            button = <LeaveGroup callToAction={this.leaveGroup} />;
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
