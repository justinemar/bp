import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import './index.css';

class DashBoardMenu extends React.Component{
    
    state = {
        prevActiveElem: null,
        active: ''
    }
    
    // Retain active tab on mount
    componentDidMount(){
        const { location } = this.props;
        const activeTab = location.pathname.split('/');
        let elem = document.querySelector(`#\\\/${activeTab[1]}\\/${activeTab[2]}`);
        if(elem){
            this.onMountActiveTab(elem.parentElement);
        }
    }
    
    // Add class again
    onMountActiveTab = (e) => {
       e.classList.add('dashboard-active-tab');
       this.setState({
           prevActiveElem: e.children[1]
       });
    }
    
    toggleTab = (e) => {
       const { prevActiveElem } = this.state;
       const { history } = this.props;
       this.toggleClassTab(
                prevActiveElem, 
                e.currentTarget, 
                () => history.push({
                        pathname: e.currentTarget.id,
                        retainElem: e.currentTarget
                })
        );
    }
    
    // Would love to have a better solution.. 
    toggleClassTab(prevActiveElem, currentTarget, navigate){
       this.setState({
           prevActiveElem: currentTarget
       });
       currentTarget.parentElement.classList.add('dashboard-active-tab');
       if(prevActiveElem && prevActiveElem !== currentTarget){
            prevActiveElem.parentElement.classList.remove('dashboard-active-tab');
       }
       navigate();
    }
    
    render(){
        const { user } = this.props;
        return (
            <div className="dashboard-menu">
                <div className="dashboard-controls">
                    <div className="dashboard-tab">
                        <label htmlFor={`/dashboard/${user.id}`}>
                            <div className="dashboard-user-icon" style={{backgroundImage: `url(${user.photoURL})`}}></div> 
                            <span className="dashboard-tab-name">
                                {user.displayName}
                            </span>
                        </label>
                        <input type="button" onClick={this.toggleTab} id={`/dashboard/${user.id}`} className="opt-none"/>
                    </div>
                    <DashBoardTab
                    tabText="Settings"
                    tabIcon="ellipsis-h"
                    tabFor="/dashboard/setting"
                    tabToggle={this.toggleTab}
                    />
                    <DashBoardTab
                    tabText="Feed"
                    tabIcon="newspaper"
                    tabFor="/dashboard/feed"
                    tabToggle={this.toggleTab}
                    />
                </div>
            </div>
        );
    }
}

const DashBoardTab = ({...props}) => {
    return (
        <div className="dashboard-tab">
            <label htmlFor={props.tabFor}>
                <FontAwesomeIcon className="dashboard-icon" icon={props.tabIcon}/> 
                    <span className="dashboard-tab-name">
                        {props.tabText}
                    </span>
            </label>
            <input type="button" onClick={props.tabToggle} id={props.tabFor} className="opt-none"/>        
        </div>
    )    
}

export default withRouter(DashBoardMenu);