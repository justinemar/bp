import React from 'react';
import MenuGroups from './MenuGroups.jsx';
import MenuSetting from './MenuSetting.jsx';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'



class DashBoardMenu extends React.Component{
    
    
    
    state = {
        tabToRender: null
    }
    
    render(){
        return (
            <div className="dashboard-menu">
                <div className="dashboard-controls">
                    <div className="dashboard-tab">
                        <label htmlFor="SettingTab">
                            <FontAwesomeIcon className="dashboard-icon" icon="ellipsis-h"/> 
                            <span className="dashboard-tab-name">
                                Settings
                            </span>
                        </label>
                        <input type="button" onClick={this.toggleTab} id="SettingTab" className="opt-none"/>
                    </div>
                    <div className="dashboard-tab dashboard-active-tab">
                        <label htmlFor="FeedTab">
                            <FontAwesomeIcon className="dashboard-icon" icon="newspaper"/> 
                            <span className="dashboard-tab-name">
                                Feed
                            </span>
                        </label>
                        <input type="button" onClick={this.toggleTab} id="FeedTab" className="opt-none"/>
                    </div>
                </div>
            </div>
        )
    }
}


export default DashBoardMenu;