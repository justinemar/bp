import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class SettingInput extends React.Component{
    
    state = {
        show: false,
        bindValue: this.props.value.info || this.props.value.displayName,
        originalValue: this.props.value.info || this.props.value.displayName
    }
    
    triggerEdit = () => {
        const newState = this.state.show ? false : true;
        this.setState({
            show: newState
        });
    }
    
    handleChange = (e) => {
        this.setState({
            bindValue: e.target.value
        });
    }
    
    
    componentWillUnmount(){
        const { bindValue, originalValue } = this.state;
        const { dataChange } = this.props;
        if(bindValue !== originalValue){
            dataChange(bindValue, originalValue);
        }   
    }
    
    render(){
        const { className, type, forLabel } = this.props;
        return (
            <div>
                { this.state.show ?
                    <input onChange={this.handleChange} className={className} type={type} value={this.state.bindValue}/>    
                    : 
                    <span className="control-default">{this.state.bindValue}</span>
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
        );
    }
}


export default SettingInput;