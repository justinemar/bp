import React from 'react';
import AuthService from '../utils/authService';




class Login extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            validation: {
                response: null,
                type: null,
                code: null
            }   
        };
        this.Auth = new AuthService;
    }

    
    login = (e) => {
        e.preventDefault();
        this.Auth.login(this.email.value, this.password.value)
        .then(res => {
            this.props.history.push('/dashboard/feed');
        })
        .catch(err => {
            this.setState({
                validation: {
                    response: err.message,
                    type: err.type
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
                          { validation.response ? 
                            <span class={validation.type}>{validation.response}</span> : null }
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


export default Login;