import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import AuthService from '../../../utils/authService';


class SettingInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            bindValue: this.props.value.email || this.props.value.name,
            originalValue: this.props.value.email || this.props.value.name,
        };
        
        this.authUtil = new AuthService();
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
        const { bindValue } = this.state;
        const originalKeyValue = this.props.value.email ? {email: this.props.value.email} : {name: this.props.value.name};
        const user_id = this.props.id;
        const value = originalKeyValue.email ? originalKeyValue.email : originalKeyValue.name;
        const { dataChange } = this.props;
        if(bindValue !== value){
            fetch(`/users/${value}`, {
                  method: 'PUT',
                  credentials: 'same-origin',
                  body: JSON.stringify({originalKeyValue, entry: bindValue, user_id}),
                  headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(res => {
                dataChange(res);
            })
            .catch(err => console.log(err));
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
                         <FontAwesomeIcon className="setting-icon" id="ban" icon="ban"/> 
                    </label>
                    :
                    <label htmlFor={forLabel}>
                        <FontAwesomeIcon className="setting-icon" id="edit" icon="edit"/> 
                    </label>
                }
                
                <input onClick={this.triggerEdit} type="button" id={forLabel} className="opt-none"/>
            </div>
        );
    }
}


export default SettingInput;