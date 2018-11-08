import React, { Component } from 'react';
import AuthService from './authService';


const DashBoardTimeOut = ({ validation, initLogout }) => (
  <div>
    { validation.code === 401
            ? (
              <div className="dashboard-timeout">
                <div className="dashboard-timeout-content">
                  <h1>
                    {validation.message}
                  </h1>
                  <button type="button" onClick={() => initLogout()}> Login to continue </button>
                </div>
              </div>
) : null }
  </div>
    );


export default function withAuth(AuthComponent) {
    const Auth = new AuthService();
    return class AuthWrapped extends Component {
        constructor() {
            super();
            this.state = {
                notificationClassName: 'nonactive-class',
                user: null,
                validation: {
                    message: null,
                    type: null,
                    code: null,
                  },
            };
            this.timeOut = null;
        }

        componentWillMount() {
        const { history } = this.props;
        if (!Auth.loggedIn()) {
            history.replace('/');
        } else {
            try {
                const profile = Auth.getProfile();
                this.setState({
                    user: profile,
                });
            } catch (err) {
                Auth.logout();
                history.replace('/');
                }
            }
        }

        updateUser = (token) => {
            Auth.setToken(token);
            const profile = Auth.getProfile();
            this.setState({
                user: profile,
            });
        }

        expiredNotice = (res) => {
            this.setState({
                validation: {
                    message: res.message,
                    type: res.type,
                    code: res.code,
                },
            });
        }

        initLogout = () => {
            const { history } = this.props;
            history.push('/', Auth.logout());
        }

        removeChageNotification = () => {
            this.setState({
                notificationClassName: 'nonactive-class',
            });
            clearTimeout(this.timeOut);
        }

        dataChange = (res) => {
            this.setState({
                notificationClassName: 'active-class',
                validation: {
                    message: res.message,
                    code: res.code,
                    type: res.type,
                },
            }, res.code === 200 ? this.updateUser(res.token) : null);

            this.timeOut = setTimeout(() => {
                this.removeChageNotification();
            }, 3000);
        }

        render() {
            const { validation, user, notificationClassName } = this.state;
            const { history } = this.props;
            if (user) {
                return (
                  <React.Fragment>
                    <DashBoardTimeOut validation={validation} initLogout={this.initLogout} {...this.props} />
                    <AuthComponent
                      notificationClassName={notificationClassName}
                      validation={validation}
                      initLogout={this.initLogout}
                      timeOut={this.expiredNotice}
                      user={user}
                      {...this.props}
                    />
                  </React.Fragment>
                );
            } else {
                return null;
            }
        }
    };
}
