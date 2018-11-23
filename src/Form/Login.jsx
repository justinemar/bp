/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import openSocket from 'socket.io-client';
import AuthService from '../utils/authService';
import Spinner from '../utils/spinner';

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
                        response: err.message,
                        type: err.type,
                        code: err.code,
                        requireVerify: err.requireVerify,
                    },
                    loading: false,
                });
            });
    }

    sendVerification = () => {
        this.setState({
            loading: true,
        });
         this.Auth.verifyEmail(this.email.value)
        .then((res) => {
            this.setState({
                validation: {
                    response: res.message,
                    type: res.type,
                    code: res.code,
               },
               loading: false,
            });
        })
        .catch((err) => {
            this.setState({
                validation: {
                    response: err.message,
                    type: err.type,
                    code: err.code,
                },
                loading: false,
            });
        });
    }

    render() {
        const { toggleForm, textNode } = this.props;
        const { validation, loading } = this.state;
        return (
          <form onSubmit={this.login}>
            <div className="root-form-actions">
              <div className="root-form-header">
                <h2> Login </h2>
              </div>
              <div className="root-form-inputs">
                {validation.requireVerify
                            ? (
                              <span className={validation.type}>
                                <p>
                                  <span>{validation.response}</span>
                                  <span>Didn't receive your code?</span>
                                  <button
                                    style={{
                                        width: '80px', background: 'transparent', fontSize: '15px', textAlign: 'left',
                                    }}
                                    type="button"
                                    onClick={this.sendVerification}
                                  ><span style={{ borderBottom: '1px solid whitesmoke' }}>Resend</span>
                                  </button>
                                </p>
                              </span>
)
                            : <span className={validation.type}>{validation.response}</span>}
                <input type="email" ref={input => this.email = input} name="email" placeholder="Email address" />
                <input type="password" ref={input => this.password = input} name="password" placeholder="Password" />
              </div>
              <div className="clear-both" />
            </div>
            <button><Spinner fetchInProgress={loading} defaultRender="Login" /></button>
            <h2 onClick={toggleForm}>
              {' '}
              {textNode}
              {' '}
            </h2>
          </form>
        );
    }
}

export default Login;
