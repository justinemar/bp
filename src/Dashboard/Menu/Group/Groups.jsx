/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';

function Button({ dynamicButton, callToAction }) {
  return (
    dynamicButton !== undefined ? (
      <React.Fragment>
        <button type="button" className={`panel-btn ${dynamicButton.class}`} onClick={() => callToAction(dynamicButton.action)}>
          {dynamicButton.text}
        </button>
      </React.Fragment>
) : <button type="button">-</button>
  );
}


class Groups extends React.Component {
    state = {
      leaveBtn: {
        text: 'LEAVE GROUP',
        action: 0,
        class: 'leave-btn',
      },
      joinBtn: {
        text: 'JOIN GROUP',
        action: 1,
        class: 'join-btn',
      },
    }

    componentDidMount() {
      const { user, group } = this.props;
      const { leaveBtn, joinBtn } = this.state;
      this.setState({
        dynamicButton: group.members.filter(member => member._id === user.id).length > 0 ? leaveBtn : joinBtn,
      });
    }

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


    callToAction = () => {
      const { dynamicButton } = this.state;
      if (dynamicButton.action) {
        this.joinGroup();
      } else {
        this.leaveGroup();
      }
    }

    render() {
        const { group } = this.props;
        const { dynamicButton } = this.state;
        return (
          <div className="a-group">
            <img className="group-logo" src={`${group.logo}`} />
            <div className="group-info">
              <div className="info-basic">
                <h3> {group.name} </h3>
                <h3>
                  <span className="members"> {group.members.length} </span>
                    Members
                </h3>
              </div>
              <div className="info-desc">
                <p>
                  {group.description}
                </p>
              </div>
            </div>
            <div className="group-join">
              <Button gid={group._id} dynamicButton={dynamicButton} callToAction={this.callToAction} />
            </div>
          </div>
        );
    }
}


export default Groups;
