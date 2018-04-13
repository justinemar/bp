import React from 'react';
import MenuGroups from './MenuGroups.jsx';
import MenuSetting from './MenuSetting';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { withRouter } from 'react-router-dom';


class DashBoardMenu extends React.Component{
    
    state = {
        prevActiveElem: null
    }
    
    componentDidMount(){
        const activeTab = this.props.location.pathname.split('/')
        let elem = document.querySelector(`#\\\/${activeTab[1]}\\/${activeTab[2]}`)
        if(elem){
            this.onMountActiveTab(elem.parentElement)
        }
    }
    
    
    onMountActiveTab = (e) => {
       e.classList.add('dashboard-active-tab');
       this.setState({
           prevActiveElem: e.children[1]
       })
    }
    
    toggleTab = (e) => {
       const { prevActiveElem } = this.state;
       console.log(e.target)
       if(e === null) {
           console.log("null")
           return false;
       }
       e.currentTarget.parentElement.classList.add('dashboard-active-tab');
       this.setState({
           prevActiveElem: e.currentTarget
       });
       if(prevActiveElem && prevActiveElem !== e.currentTarget){
            prevActiveElem.parentElement.classList.remove('dashboard-active-tab');
       }   
        this.props.history.replace({
            pathname: e.currentTarget.id,
            retainElem: e.currentTarget
        })
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