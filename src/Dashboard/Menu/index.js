import React from 'react';
import MenuGroups from './MenuGroups.jsx';
import MenuSetting from './MenuSetting';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { withRouter } from 'react-router-dom';


class DashBoardMenu extends React.Component{
    
    state = {
        prevActiveElem: null
    }
    
    
    
    toggleTab = (e) => {
       const { prevActiveElem } = this.state;
       e.currentTarget.parentElement.classList.add('dashboard-active-tab');
       this.setState({
           prevActiveElem: e.currentTarget
       });
       if(prevActiveElem !== e.currentTarget){
            prevActiveElem.parentElement.classList.remove('dashboard-active-tab');
            this.props.history.replace(e.currentTarget.id)
       }   
    }
    
    render(){
        return (
            <div className="dashboard-menu">
                <div className="dashboard-controls">
                    <div className="dashboard-tab">
                        <label htmlFor="/dashboard/setting">
                            <FontAwesomeIcon className="dashboard-icon" icon="ellipsis-h"/> 
                            <span className="dashboard-tab-name">
                                Settings
                            </span>
                        </label>
                        <input type="button" onClick={this.toggleTab} id="/dashboard/setting" className="opt-none"/>
                    </div>
                    <div className="dashboard-tab">
                        <label htmlFor="/dashboard/feed">
                            <FontAwesomeIcon className="dashboard-icon" icon="newspaper"/> 
                            <span className="dashboard-tab-name">
                                Feed
                            </span>
                        </label>
                        <input type="button" onClick={this.toggleTab} id="/dashboard/feed" className="opt-none"/>
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(DashBoardMenu);