import React from 'react';
import errors from '../err-codes/errors';





class Register extends React.Component{
    state = {
        validation: {
            response: null,
            type: null,
        },
        password: {

        },
        email: {

        }
    }
    
    
    checkFields = (a) => {
        const regEmpty = "^\\s+$";
        const input = document.getElementsByTagName('input');
        Array.prototype.slice.call(input).forEach(i => {
            if(regEmpty.match(i.value)){
                i.className = 'input-error';
            } else {
                this.setState({
                    validation: {
                        ...null
                    }
                })
            }
        })
    }
    
    
    register = (e) => {
        e.preventDefault();
        const { validation, email, password } = this.state;
        if(validation.type === 'error' || password.type === 'error' || email.type === 'error'){
            return false;
        }
        
        if(this.email.value === '' || this.password.value === ''){
            this.setState({
                validation: {
                    response: 'Missing informations!',
                    type: 'error',
                    inputErr: 'input-error'
                }
            }, this.checkFields());
            return false
        }
        
        fetch('/register', {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify({email: this.email.value,  password: this.password.value, name: this.name.value}),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
          .then(res => {
              this.setState({
                  validation: {
                      response: res.message,
                      type: res.type,
                  }
              });
         });
    }
    

    
    validateInput = (e) => {
        let err_res;
        if(e.target.name === 'email') {
            const regEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            err_res = regEmail.test(this.email.value) ? null : errors.email_error;
            this.setState({
                email: {
                    ...err_res,
                }
            });
            this.checkFields();
            return false;
            
        } else if (e.target.name === 'password_confirm' || e.target.name === 'password') {
            err_res = this.password.value === this.password_confirm.value ? null : errors.password_error;
            this.setState({
                password: {
                    ...err_res 
                }
            });
            this.checkFields();
            return false;
        }
    }
    
    render(){
        const { toggleForm , textNode} = this.props;
        const { validation, email, password } = this.state;
        return(
             <form onSubmit={this.register}>
                    <div class="root-form-actions">
                        <div class="root-form-header">
                             <h2> Register  </h2>
                        </div>
                        <div class="root-form-inputs">
                        { validation.response ? 
                            <span class={validation.type}>{validation.response}</span> : null }
                        { email.response ? 
                            <span class={email.type}>{email.response}</span> : null }
                        { password.response ? 
                            <span class={password.type}>{password.response}</span> : null }
                            <input className={email.emailErr} autocomplete="off" type="email" onChange={this.validateInput} ref={(input) => this.email = input} name="email" placeholder="Email address"/>
                            <input className={email.emailErr} type="text" onChange={this.validateInput} ref={(input) => this.name = input} name="name" placeholder="Display name"/>
                            <input className={password.passErr} type="password" onChange={this.validateInput} ref={(input) => this.password = input} name="password" placeholder="Password"/>
                            <input className={password.passErr} type="password" onChange={this.validateInput} ref={(input) => this.password_confirm = input} name="password_confirm" placeholder="Confirm Password"/>
                        </div>
                        <div class="clear-both">
                        </div>
                    </div>
                    <button>Create Account </button>
                    <h2 onClick={toggleForm}> {textNode} </h2>
              </form>
        )
    }
}

export default Register;
