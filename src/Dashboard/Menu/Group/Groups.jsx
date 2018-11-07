/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import GroupControl from './GroupControl';


class Groups extends React.Component {
    render() {
        const { group, user } = this.props;
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
              <GroupControl group={group} user={user} />

            </div>
          </div>
        );
    }
}


export default Groups;
