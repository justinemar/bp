import React from 'react';


const Errors = ({ errors }) => Object.values(errors).map((val) => {
        if (val !== null) {
            return (
              <p className="error">
                {val}
              </p>);
        }
            return null;
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
            network: {
                response: null,
                type: null,
            },
        };
    }

    register = (e) => {
        e.preventDefault();
        if (this.emptyFields().length > 0) {
            this.setState(previousState => ({
                errors: {
                    ...previousState.errors,
                    inputErr: 'Missing informations!',
                },
            }));
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
                });
            });
    }


    toggleClass = (error, target) => {
        if (error) {
            target.className = 'input-error';
            return;
        }

        target.className = 'input-success';
    }


    validateInput = (e) => {
        // empty fields error
        let input_error = this.emptyFields();
        const refs = [this.email, this.display_name, this.password, this.password_confirm];
        let emailError = this.state.errors.email;
        let passwordError = this.state.errors.password;
        let passwordConfirmError = this.state.errors.passwordConfirm;
        let displayNameError = this.state.errors.displayName;
        const passwordConfirmValid = this.password_confirm.value === this.password.value;
        passwordConfirmError = passwordConfirmValid ? null : 'Password do not match.';
        this.toggleClass(passwordConfirmError, this.password_confirm);


        // Validate values
        switch (e.target) {
            case this.email:
                const emailValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.email.value);
                emailError = emailValid ? null : 'Invalid email address.';
                this.toggleClass(emailError, this.email);
                break;
            case this.password:
                const passwordValid = /^(?=.*\d).{8,}$/.test(this.password.value);
                passwordError = passwordValid ? null : 'Password must be at least 8 characters long and must contain at least 1 digit.';
                this.toggleClass(passwordError, this.password);
                break;
            case this.display_name:
                displayNameError = /^[a-zA-Z0-9_]*$/.test(this.display_name.value) ? null : 'Usernames may only contain letters, numbers, and _.';
                this.toggleClass(displayNameError, this.display_name);
                input_error = this.emptyFields();
            default:
                break;
        }

        this.setState({
            errors: {
                inputErr: input_error.length > 0 ? 'Missing informations!' : null,
                email: emailError,
                password: passwordError,
                passwordConfirm: passwordConfirmError,
                displayName: displayNameError,
            },
        });
    }

    emptyFields() {
        const refs = [this.email, this.display_name, this.password, this.password_confirm];
        let error = null;
        const empty = refs.filter((input) => {
            if (input.value === '') {
                error = true;
                this.toggleClass(error, input);
                return input;
            }
        });
        return empty;
    }

    render() {
        const { toggleForm, textNode } = this.props;
        const { network, errors } = this.state;
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
                <input autoComplete="off" type="email" onChange={this.validateInput} ref={input => this.email = input} name="email" placeholder="Email address" />
                <input type="text" onChange={this.validateInput} ref={input => this.display_name = input} name="display_name" placeholder="Display name" />
                <input type="password" onChange={this.validateInput} ref={input => this.password = input} name="password" placeholder="Password" />
                <input type="password" onChange={this.validateInput} ref={input => this.password_confirm = input} name="password_confirm" placeholder="Confirm Password" />
              </div>
              <div className="clear-both" />
            </div>
            <button>Create Account </button>
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
