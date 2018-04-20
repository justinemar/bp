import React from 'react';
import { withRouter } from 'react-router-dom';




class MenuSetting extends React.Component{
    
    componentDidMount(){
          
    }
    
    render(){
        return (
            <div className="section-selected-tab">
            <div className="setting-menu">
                <div className="menu-tabs-container">
                    <ul className="menu-list">
                        <li>
                        <div className="menu-account-tab">
                            <div className="menu-tab-title">
                                <h3> Account </h3>
                            </div>
                            <div className="menu-tab-controls">
                            <label htmlFor="displayName"></label>
                            <input id="displayName" type="text"/>
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