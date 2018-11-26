import React from 'react';
import { withRouter } from 'react-router-dom';
import Tab from './Tab';
import './index.css';

class DashBoardMenu extends React.Component {
      toggleTab = (e) => {
        const { history, location } = this.props;
        history.push({
            pathname: e.currentTarget.id,
            from: location.pathname,
        });
    };

    render() {
        return (
          <div className="dashboard-menu">
            <Tab toggleTab={this.toggleTab} {...this.props} />
          </div>
        );
    }
}

export default withRouter(DashBoardMenu);
