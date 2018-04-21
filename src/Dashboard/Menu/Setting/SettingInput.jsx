import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class SettingInput extends React.Component{
    
    state = {
        show: false    
    }
    
    triggerEdit = () => {
        const newState = this.state.show ? false : true;
        this.setState({
            show: newState
        })
    }
    render(){
        const { className, type, value, forLabel } = this.props;
        return (
            <div>
                { this.state.show ?
                    <input className={className} type={type} value={value.info}/>    
                    : 
                    <span className="control-default">{value.displayName || value.info}</span>
                }
                
                { this.state.show ?
                    <label htmlFor={forLabel}>
                         <FontAwesomeIcon className="setting-icon" icon="ban"/> 
                    </label>
                    :
                    <label htmlFor={forLabel}>
                        <FontAwesomeIcon className="setting-icon" icon="edit"/> 
                    </label>
                }
                
                <input onClick={this.triggerEdit} type="button" id={forLabel} className="opt-none"/>
            </div>
        )
    }
}


export default SettingInput;