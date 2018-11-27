/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import openSocket from 'socket.io-client';
import AuthService from '../utils/authService';
import Spinner from '../Shared/Spinner';

const socket = openSocket('/');

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validation: {
                response: '',
                type: '',
                code: '',
            },
            loading: false,
        };
        this.Auth = new AuthService();
    }


    login = (e) => {
        e.preventDefault();

        this.setState({
            loading: true,
        });
        this.Auth.login(this.email.value, this.password.value)
            .then((res) => {
                socket.emit('authed', this.Auth.getProfile(res));
                this.props.history.push('/dashboard');
            })
            .catch((err) => {
                this.setState({
                    validation: {
                        response: 'Something went wrong..',
                        type: 'error',
                        code: err.code,
                        err,
                    },
                    loading: false,
                });
            });
    }

    render() {
        const { toggleForm, textNode } = this.props;
        const { validation, loading } = this.state;
        return (
          <form onSubmit={this.login} autoComplete="on">
            <div className="root-form-actions">
              <div className="root-form-header">
                <h2> Login </h2>
              </div>
              <div className="root-form-inputs">
                <span className={validation.type}>{validation.response}</span>
                <input type="email" ref={input => this.email = input} name="email" placeholder="Email address" />
                <input type="password" ref={input => this.password = input} name="password" placeholder="Password" />
              </div>
              <div className="clear-both" />
            </div>
            <button disabled={!this.state.email}><Spinner fetchInProgress={loading} defaultRender="Login" /></button>
            <h2 onClick={toggleForm}>
              {textNode}
            </h2>
          </form>
        );
    }
}

export default Login;
