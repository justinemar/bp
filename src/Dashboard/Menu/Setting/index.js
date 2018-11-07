import React from 'react';
import { withRouter } from 'react-router-dom';
import SettingInput from './SettingInput.jsx';
import './setting.css';



class MenuSetting extends React.Component {
    render() {
        const { user, dataChange, updateUser } = this.props;
        return (
            <div className="section-selected-tab">
                <div className="setting-menu">
                    <div className="menu-tabs-container">
                        <ul className="menu-list">
                            <li>
                                <div className="menu-account-tab">
                                    <div className="menu-tab-title">
                                        <h3> General Account </h3>
                                    </div>
                                    <div className="menu-tab-controls">
                                        <div className="tab-control display-name-control">
                                            <div className="tab-content">
                                                <label htmlFor="displayName" className="labelText">Display name:</label>
                                                <SettingInput
                                                    type="text"
                                                    value={{ name: user.displayName }}
                                                    id={user.id}
                                                    forLabel="edit-name"
                                                    dataChange={dataChange}
                                                    updateUser={updateUser} />
                                            </div>
                                        </div>
                                        <div className="tab-control email-control">
                                            <div className="tab-content">
                                                <label htmlFor="email" className="labelText">Email:</label>
                                                <SettingInput
                                                    type="email"
                                                    value={{ email: user.email }}
                                                    id={user.id}
                                                    forLabel="edit-email"
                                                    dataChange={dataChange}
                                                    updateUser={updateUser} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(MenuSetting);