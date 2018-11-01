import React from 'react';
import { matchPath } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';


class Tab extends React.Component {
    render() {
        const { user, toggleTab } = this.props;
        return (
            <div className="dashboard-controls">
                <DashBoardTab
                    customIcon={true}
                    tabText="Dashboard"
                    tabIcon="https://res.cloudinary.com/dhwgznjct/image/upload/v1539845434/bida_hexo8o.png"
                    tabFor="/dashboard"
                    tabToggle={toggleTab}
                    {...this.props} />
                <DashBoardTab
                    customIcon={true}
                    tabText={user.displayName}
                    tabIcon={user.photoURL}
                    tabFor={`/dashboard/${user.id}`}
                    tabToggle={toggleTab}
                    {...this.props} />
                <DashBoardTab
                    tabText="Settings"
                    tabIcon="sliders-h"
                    tabFor="/dashboard/setting"
                    tabToggle={toggleTab}
                    {...this.props} />
                <DashBoardTab
                    tabText="Feed"
                    tabIcon="newspaper"
                    tabFor="/dashboard/feed"
                    tabToggle={toggleTab}
                    {...this.props} />
            </div>
        )
    }
}

export default Tab;

const DashBoardTab = ({ ...props }) => {
    const isActiveTab = matchPath(props.location.pathname, props.tabFor);
    const activeClass = isActiveTab ? 'dashboard-active-tab' : '';
    return (
        <div className={`dashboard-tab ${activeClass}`}>
            <label htmlFor={props.tabFor}>
                {props.customIcon ?
                    <div className="dashboard-custom-icon" style={{ backgroundImage: `url(${props.tabIcon})` }}></div> :
                    <FontAwesomeIcon className="dashboard-icon" icon={props.tabIcon} />
                }
                <span className="dashboard-tab-name">
                    {props.tabText}
                </span>
            </label>
            <input type="button" onClick={props.tabToggle} id={props.tabFor} className="opt-none" />
        </div>
    )
}