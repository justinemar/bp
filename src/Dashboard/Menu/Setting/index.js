import React from 'react';
import { withRouter } from 'react-router-dom';
import SettingInput from './SettingInput.jsx';
import './setting.css';



class MenuSetting extends React.Component{
    
    componentDidMount(){
          
    }
    
    render(){
        const { user } = this.props;
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
                                        value={user}
                                        forLabel="edit-name"/>
                                    </div>
                                </div>
                                <div className="tab-control email-control">
                                    <div className="tab-content">
                                        <label htmlFor="email" className="labelText">Email:</label>
                                        <SettingInput 
                                        type="email"
                                        value={user}
                                        forLabel="edit-email"/>
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