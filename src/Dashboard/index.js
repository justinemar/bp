import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import DashBoardStatusContainer from './Status';
import DashBoardNotification from './Notification';
import DashBoardMenu from './Menu';
import Home from './Menu/Home';
import MenuSetting from './Menu/Setting';
import MenuProfile from './Menu/Profile';
import MenuGroups from './Menu/Group';
import GroupWizard from './Menu/Group/GroupWizard';
import GroupLounge from './Menu/Group/GroupLounge';
import AuthService from '../utils/authService';
import withAuth from '../utils/withAuth';
import './dashboard.css';


const DashBoardDataChange = ({ validation, notification_className }) => (
  <div className="dashboard-change-notificaiton">
    <div className={`dashboard-change-content ${notification_className}`}>
      <FontAwesomeIcon className="change-icon" icon="save" />
      <h1>{validation.message}</h1>
    </div>
  </div>
    );


const LogoutButton = ({ initLogout }) => (
  <div className="logout-wrapper">
    <div className="logout-icon">
      <FontAwesomeIcon onClick={initLogout} icon="sign-out-alt" />
    </div>
  </div>
    );


class DashBoard extends React.Component {
    constructor(props) {
        super(props);
        this.authUtil = new AuthService();
    }


    render() {
        const { notificationClassName, ...prop } = this.props;
        const customProps = {
          Auth: this.authUtil,
          timeOut: prop.timeOut,
          dataChange: prop.dataChange,
          user: prop.user,
          initLogout: prop.initLogout,
          validation: prop.validation,
       };
        return (
          <div className="dashboard-wrapper">
            <LogoutButton initLogout={customProps.initLogout} />
            <DashBoardDataChange notification_className={notificationClassName} validation={customProps.validation} />
            <div className="dashboard-main-content">
              <DashBoardMenu {...this.props} />
              <DashBoardNotification />
              <Switch>
                <Route exact path="/dashboard" render={() => <Home Auth={this.authUtil} {...this.props} />} />
                <Route path="/dashboard/setting" render={() => <MenuSetting dataChange={customProps.dataChange} {...this.props} />} />
                <Route path="/dashboard/feed" render={() => <DashBoardStatusContainer {...this.props} />} />
                <Route exact path="/dashboard/groups" render={props => <MenuGroups {...customProps} Auth={this.authUtil} {...props} />} />
                <Route path="/dashboard/groups/lounge" render={props => <GroupLounge {...customProps} Auth={this.authUtil} {...props} />} />
                <Route path="/dashboard/groups/create" render={props => <GroupWizard {...customProps} Auth={this.authUtil} {...props} />} />
                <Route path="/dashboard/:user_id" render={props => <MenuProfile {...customProps} Auth={this.authUtil} {...props} />} />
              </Switch>
            </div>
          </div>
        );
    }
}
export default withAuth(DashBoard);
