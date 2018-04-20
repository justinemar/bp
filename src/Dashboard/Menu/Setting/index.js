import React from 'react';
import { withRouter } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
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
                                        <input id="displayName" type="text" value={user.info}/>    
                                        <span className="control-default">{user.displayName || user.info}</span>
                                         <label htmlFor="edit-name">
                                            <FontAwesomeIcon className="setting-icon" icon="edit"/> 
                                        </label>
                                        <input onClick={() => alert('1')} type="button" id="edit-name" className="opt-none"/>
                                    </div>
                                </div>
                                <div className="tab-control email-control">
                                    <div className="tab-content">
                                        <label htmlFor="email" className="labelText">Email:</label>
                                        <input id="email" type="email" value={user.info}/>
                                        <span className="control-default">{user.info}</span>
                                        <label htmlFor="edit-email">
                                            <FontAwesomeIcon className="setting-icon" icon="edit"/> 
                                        </label>
                                        <input onClick={() => alert('2')} type="button" id="edit-email" className="opt-none"/>
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