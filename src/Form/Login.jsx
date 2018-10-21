import React from 'react';
import AuthService from '../utils/authService';




class Login extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            validation: {
                response: '',
                type: '',
                code: ''
            }   
        };
        this.Auth = new AuthService;
    }

    
    login = (e) => {
        e.preventDefault();
        this.Auth.login(this.email.value, this.password.value)
        .then(res => {
            console.log(res)
            this.props.history.push('/dashboard');
        })
        .catch(err => {
            this.setState({
                validation: {
                    response: err.message,
                    type: err.type,
                    code: err.code
                }
            });
        });
    }
    
    render(){
        const { toggleForm, textNode} = this.props;
        const { validation } = this.state;
        return (
             <form onSubmit={this.login}>
                    <div class="root-form-actions">
                        <div class="root-form-header">
                            <h2> Login </h2>
                        </div>
                        <div class="root-form-inputs">
                        {validation.code === 403 ?  
         <span class={validation.type}>{validation.response} <button onClick={() => this.props.history.push(`/resend/${this.email.value}`)}>Resend</button></span> :
         <span class={validation.type}>{validation.response}</span> }
                            <input type="email" ref={(input) => this.email = input} name="email" placeholder="Email address"/>
                            <input type="password" ref={(input) => this.password = input} name="password" placeholder="Password"/>
                        </div>
                        <div class="clear-both">
                        </div>
                    </div>
                    <button>Login</button>
                    <h2 onClick={toggleForm}> {textNode} </h2>
              </form>
          );
    }
}

const Validation = (validation, resend) => {
  return (
      <React.Fragment>
         {validation.code === 403 ?  
         <span class={validation.type}>{validation.response} Resend</span> :
         <span class={validation.type}>{validation.response}</span> }
      </React.Fragment>
  )
}

export default Login;