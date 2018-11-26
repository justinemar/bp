/* eslint-disable no-param-reassign */
import React from 'react';
import openSocket from 'socket.io-client';
import Spinner from '../Shared/Spinner';
import AuthService from '../utils/authService';

const socket = openSocket('/');

const Errors = ({ errors }) => Object.values(errors).map((val, key) => {
        if (val === null || val === undefined) {
            return null;
        }
            return (
              // eslint-disable-next-line react/no-array-index-key
              <p className="error" key={key}>
                {val}
              </p>);
    });


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {
                inputErr: null,
                email: null,
                displayName: null,
                password: null,
                passwordConfirm: null,
            },
            hasError: false,
            network: {
                response: null,
                type: null,
            },
            loading: false,
            email: '',
            username: '',
        };
        this.Auth = new AuthService();
    }

    register = async (e) => {
        e.preventDefault();
        const { hasError } = this.state;
        const { history } = this.props;
        this.setState({
            loading: true,
        });

        if (this.emptyFields().length > 0 || hasError) {
            this.setState({
                loading: false,
            });
            return;
        }

        fetch('/register', {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(
                {
                    email: this.email.value,
                    password: this.password.value,
                    name: this.display_name.value,
                },
            ),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json())
            .then((res) => {
                this.setState({
                    network: {
                        response: res.message,
                        type: res.type,
                    },
                    loading: false,
                }, (okToLogin = res.code) => {
                    if (okToLogin === 200) {
                        this.Auth.login(this.email.value, this.password.value)
                        .then((loginRes) => {
                            socket.emit('authed', this.Auth.getProfile(loginRes));
                            history.push('/dashboard');
                        });
                    }
                });
            });
    }


    toggleClass = (error, elems) => {
        elems.map((input) => {
            if (error !== null) {
                input.className = 'input-error';
                this.setState({
                    hasError: true,
                });
                return;
            }

            input.className = 'input-success';
        });
    }


    validateInput = (e) => {
        const {
        errors: {
                email, password, passwordConfirm, displayName,
            },
        } = this.state;
        // eslint-disable-next-line one-var
        let emailError = email;
        let passwordError = password;
        let passwordConfirmError = passwordConfirm;
        let displayNameError = displayName;
        let passwordMatch;
        // empty fields error

        // Validate values
        switch (e.target) {
            case this.password_confirm: {
                 passwordMatch = this.password_confirm.value === this.password.value;
                 passwordConfirmError = passwordMatch ? null : 'Password do not match.';
                 this.toggleClass(passwordConfirmError, [this.password, this.password_confirm]);
                 break;
            }
            case this.email: {
                this.setState({ email: e.currentTarget.value });
                const emailValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.email.value);
                emailError = emailValid ? null : 'Invalid email address.';
                this.toggleClass(emailError, [this.email]);
                break;
            }
            case this.password: {
                const passwordValid = /^(?=.*\d).{8,}$/.test(this.password.value);
                passwordMatch = this.password_confirm.value === this.password.value;
                passwordError = passwordValid ? null : 'Password must be at least 8 characters long and must contain at least 1 digit.';
                passwordConfirmError = passwordMatch ? null : 'Password do not match.';
                this.toggleClass(passwordConfirmError, [this.password, this.password_confirm]);
                   break;
            }
            case this.display_name: {
                this.setState({ username: e.currentTarget.value });
                displayNameError = /^[a-zA-Z0-9_]*$/.test(this.display_name.value) ? null : 'Usernames may only contain letters, numbers, and _.';
                this.toggleClass(displayNameError, [this.display_name]);
                break;
            }
            default: {
                break;
            }
        }
        this.setState(previousState => ({
            errors: {
                ...previousState.errors,
                email: emailError,
                password: passwordError,
                passwordConfirm: passwordConfirmError,
                displayName: displayNameError,
            },
        }));
    }

    emptyFields() {
        const refs = [this.email, this.display_name, this.password, this.password_confirm];
        const empty = refs.filter((input) => {
            if (input.value === '') {
                this.setState(
                prevState => ({
                    errors: {
                        ...prevState.errors,
                        inputErr: 'Missing Informations!',
                    },
                    hasError: true,
                }),
                );
                this.toggleClass(true, [input]);
                return input;
            }
        });

        this.setState({
            hasError: false,
        });
        return empty;
    }

    render() {
        const { toggleForm, textNode } = this.props;
        const { network, errors, loading } = this.state;
        return (
          <form onSubmit={this.register}>
            <div className="root-form-actions">
              <div className="root-form-header">
                <h2 ref={this.textInput}> Register  </h2>
              </div>
              <div className="root-form-inputs">
                <Errors errors={errors} />
                {network.response
                            ? <span className={network.type}>{network.response}</span> : null}
                <input autoComplete="off" type="email" onChange={this.validateInput} ref={input => this.email = input} name="email" placeholder="Email address" value={this.state.email} />
                <input type="text" onChange={this.validateInput} ref={input => this.display_name = input} name="display_name" placeholder="Display name" value={this.state.username} />
                <input type="password" onChange={this.validateInput} ref={input => this.password = input} name="password" placeholder="Password" />
                <input type="password" onChange={this.validateInput} ref={input => this.password_confirm = input} name="password_confirm" placeholder="Confirm Password" />
              </div>
              <div className="clear-both" />
            </div>
            <button id="register"><Spinner fetchInProgress={loading} defaultRender="Register" /></button>
            <h2 onClick={toggleForm}>
              {' '}
              {textNode}
              {' '}
            </h2>
          </form>
        );
    }
}

export default Register;
