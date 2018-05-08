import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import './index.css';

class DashBoardMenu extends React.Component{
    
    state = {
        prevActiveElem: null
    }
    
    componentDidMount(){
        const { location } = this.props;
        const activeTab = location.pathname.split('/');
        let elem = document.querySelector(`#\\\/${activeTab[1]}\\/${activeTab[2]}`);
        if(elem){
            this.onMountActiveTab(elem.parentElement);
        }
    }
    
    onMountActiveTab = (e) => {
       e.classList.add('dashboard-active-tab');
       this.setState({
           prevActiveElem: e.children[1]
       });
    }
    
    toggleTab = (e) => {
       const { prevActiveElem } = this.state;
       const { history } = this.props;
       if(e === null) {
           return false;
       }
        this.toggleClassTab(
                prevActiveElem, 
                e.currentTarget, 
                () => history.push({
                        pathname: e.currentTarget.id,
                        retainElem: e.currentTarget
                })
        );
    }
    
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
                        <label htmlFor="/dashboard/me">
                            <div className="dashboard-user-icon" style={{backgroundImage: `url(${user.photoURL})`}}></div> 
                            <span className="dashboard-tab-name">
                                {user.displayName}
                            </span>
                        </label>
                        <input type="button" onClick={this.toggleTab} id="/dashboard/me" className="opt-none"/>
                    </div>
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
        );
    }
}


export default withRouter(DashBoardMenu);