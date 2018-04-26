import React from 'react';
import { withRouter } from 'react-router-dom';
import SettingInput from './SettingInput.jsx';
import './setting.css';



class MenuSetting extends React.Component{
    
    componentDidMount(){
          
    }
    
    render(){
        const { user, dataChange } = this.props;
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
                                        value={{name: user.displayName}}
                                        id={user.id}
                                        forLabel="edit-name"
                                        dataChange={dataChange}/>
                                    </div>
                                </div>
                                <div className="tab-control email-control">
                                    <div className="tab-content">
                                        <label htmlFor="email" className="labelText">Email:</label>
                                        <SettingInput 
                                        type="email"
                                        value={{email: user.info}}
                                        id={user.id}
                                        forLabel="edit-email"
                                        dataChange={dataChange}/>
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