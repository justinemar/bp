/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import Groups from './Groups';
import './group.css';


class MenuGroups extends React.Component {
    constructor() {
      super();
      this.state = {
        groups: [],
        filter: {
          sort: 'sort by',
          requirement: 'requirement',
        },
      };
    }

    componentDidMount() {
      fetch('/groups', {
        method: 'GET',
      })
      .then(res => res.json())
      .then((res) => {
        this.setState({
          groups: res,
        });
      });
    }

    sort = (sortBy) => {
      const { groups } = this.state;
      const copy = [...groups].sort((a, b) => b.members.length - a.members.length);
      if (sortBy === 'members') {
        this.setState({
          groups: copy,
        }, console.log('sorted', copy, groups));
      }
    }

    sortGroup = (e) => {
      console.log(e.target.id, e.target.value);
      if (e.target.id === 'sorting') {
        this.setState({
          filter: {
            ...this.state.filter,
            sort: e.target.value,
          },
        }, this.sort(e.target.value));
      } else if (e.target.id === 'requirement') {
        this.setState({
          filter: {
            ...this.state.filter,
            sort: e.target.value,
          },
        }, this.requirement(e.target.value));
      }
    }

    requirement = (sortBy) => {
      const { groups } = this.state;
      if (sortBy === 'public') {
        const publicFirst = [...groups].sort((a, b) => b.public - a.public);
        this.setState({
          groups: publicFirst,
        });
      } else if (sortBy === 'private') {
        const privateFirst = [...groups].sort((a, b) => a.public - b.public);
        this.setState({
          groups: privateFirst,
        });
      }
    }

    render() {
        const { groups, filter } = this.state;
        const { user, history } = this.props;
        // eslint-disable-next-line arrow-body-style
        const renderGroups = groups && groups.length > 0 ? groups.map((group) => {
          return (
            <Groups user={user} group={group} />
          );
        }) : 'Nothing to see here';
        return (
          <div className="section-selected-tab">
            <div className="groups-panel">
              <div className="panel-head">
                <h1>Groups</h1>
                <div className="groups-panel-filter">
                  <span>filter</span>
                  <select id="sorting" onChange={this.sortGroup} value={filter.sort}>
                    <option value="sort">sort by</option>
                    <option value="members">Members</option>
                    <option value="rank">Ranking</option>
                    <option value="achievements">Achievements</option>
                  </select>
                  <select id="requirement" onChange={this.sortGroup} value={filter.requirement}>
                    <option value="requirement">requirement</option>
                    <option value="public">Auto Join</option>
                    <option value="private">Request to join</option>
                  </select>
                  <div className="group-create">
                    <button type="button" className="panel-btn create-btn" onClick={() => history.push('/dashboard/groups/create')}>
                      { 'CREATE' }
                    </button>
                  </div>
                </div>
              </div>
              <div className="groups-menu">
                {renderGroups}
              </div>
            </div>
          </div>
        );
    }
}


export default MenuGroups;
