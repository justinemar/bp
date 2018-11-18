/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import DashBoardStatusContainer from './Status';
import DashBoardNotification from './Notification';
import DashBoardMenu from './Menu';
import Discover from './Menu/Discover';
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
  <div className="quick-menu-tab scale-up-center tooltip-left">
    <div className="quick-menu-tab-icon">
      <FontAwesomeIcon onClick={initLogout} icon="sign-out-alt" />
    </div>
    <span className="tooltiptext-left" id="owner">Sign out</span>
  </div>
    );

const QuickMenu = ({
  toggleQuickMenu, quickMenu, initLogout, user, toggleQuickTab,
  }) => (
    <div className="scale-up-center quick-menu-wrapper">
      {quickMenu.toggle
    ? (
      <div className="quick-menu-contents quick-menu-scale">
        <QuickMenuTabs toggleQuickTab={toggleQuickTab} user={user} />
        <LogoutButton initLogout={initLogout} />
      </div>
      ) : null }
      <div className="quick-menu-icon">
        <FontAwesomeIcon onClick={toggleQuickMenu} icon={quickMenu.toggle ? 'times' : 'bars'} />
      </div>
    </div>
);


const QuickMenuTabs = ({ toggleQuickTab, user }) => (
  <React.Fragment>
    <QuickMenuTab
      tabText="Discover"
      tabIcon={['fab', 'searchengin']}
      tabFor="/dashboard/discover"
      tabToggle={toggleQuickTab}
    />
    <QuickMenuTab
      customIcon
      tabText={user.displayName}
      tabIcon={user.photoURL}
      tabFor={`/dashboard/${user.id}`}
      tabToggle={toggleQuickTab}
    />
    <QuickMenuTab
      tabText="Settings"
      tabIcon="sliders-h"
      tabFor="/dashboard/setting"
      tabToggle={toggleQuickTab}
    />
    <QuickMenuTab
      tabText="Feed"
      tabIcon="newspaper"
      tabFor="/dashboard/feed"
      tabToggle={toggleQuickTab}
    />
    <QuickMenuTab
      tabText="Groups"
      tabIcon="fist-raised"
      tabFor="/dashboard/groups"
      tabToggle={toggleQuickTab}
    />
  </React.Fragment>
);

const QuickMenuTab = ({ ...props }) => (
  <div className="quick-menu-tab scale-up-center tooltip-left">
    <div className="quick-menu-tab-icon">
      <label htmlFor={props.tabFor}>
        {props.customIcon
        ? (
          <div
            className="quick-menu-custom-icon"
            style={{
            backgroundImage: `url(${props.tabIcon})`,
            backgroundSize: 'cover',
            width: '100%',
            height: '100%',
            borderRadius: '100%',
            cursor: 'pointer',
            }}
          />
          )
        : <FontAwesomeIcon className="quick-menu-tab-icon" icon={props.tabIcon} />
      }
      </label>
    </div>
    <span className="tooltiptext-left" id="owner">{props.tabText}</span>
    <input type="button" onClick={props.tabToggle} id={props.tabFor} className="opt-none" />

  </div>
);

class DashBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          quickMenu: {
            toggle: false,
            active: false,
          },
        };
        this.authUtil = new AuthService();
    }

    componentDidMount() {
      window.addEventListener('resize', () => {
        this.setState(
          prevState => ({
              quickMenu: {
                ...prevState.quickMenu,
                active: window.innerWidth < 850,
              },
          }),
        );
      });

      this.setState({
          quickMenu: {
            toggle: false,
            active: window.innerWidth < 850,
          },
      });
    }

    toggleQuickTab = (e) => {
      const { history, location } = this.props;
      console.log(e.currentTarget.id);
      history.push({
          pathname: e.currentTarget.id,
          from: location.pathname,
      });
  };

    toggleQuickMenu = () => {
      const { quickMenu: { toggle } } = this.state;
      this.setState(
        prevState => ({
            quickMenu: {
              ...prevState.quickMenu,
              toggle: !toggle,
            },
        }),
      );
    }

    render() {
        const {
          notificationClassName, history, location, match, ...prop
        } = this.props;
        const { quickMenu } = this.state;
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
            { quickMenu.active
            ? (
              <QuickMenu
                user={customProps.user}
                initLogout={customProps.initLogout}
                quickMenu={quickMenu}
                toggleQuickMenu={this.toggleQuickMenu}
                toggleQuickTab={this.toggleQuickTab}
              />
            ) : null }
            <DashBoardDataChange
              notification_className={notificationClassName}
              validation={customProps.validation}
            />
            <div className="dashboard-main-content">
              <DashBoardMenu {...this.props} />
              <DashBoardNotification />
              <Switch>
                <Route exact path="/dashboard" render={() => <Redirect to="/dashboard/discover" />} />
                <Route path="/dashboard/discover" render={() => <Discover Auth={this.authUtil} {...this.props} />} />
                <Route path="/dashboard/setting" render={() => <MenuSetting dataChange={customProps.dataChange} {...this.props} />} />
                <Route path="/dashboard/feed" render={() => <DashBoardStatusContainer {...this.props} />} />
                <Route exact path="/dashboard/groups" render={props => <MenuGroups {...customProps} Auth={this.authUtil} {...props} />} />
                <Route path="/dashboard/groups/create" render={props => <GroupWizard {...customProps} Auth={this.authUtil} {...props} />} />
                <Route path="/dashboard/groups/:group" render={props => <GroupLounge {...customProps} Auth={this.authUtil} {...props} />} />
                <Route path="/dashboard/:user_id" render={props => <MenuProfile {...customProps} Auth={this.authUtil} {...props} />} />
              </Switch>
            </div>
          </div>
        );
    }
}
export default withAuth(DashBoard);
