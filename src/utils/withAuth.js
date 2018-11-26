import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import AuthService from './authService';
import Spinner from '../Shared/Spinner';

const socket = openSocket('/');

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

const VerifyEmailNotice = ({ ...props }) => {
    const {
        validation: { message },
        closeNotice,
        textNode,
        loading,
        emailNoticeActive,
    } = props;
    return (
      <div>
        {emailNoticeActive
                ? (
                  <div className="dashboard-verifyEmail scale-up-hor-center">
                    <div className="dashboard-verifyEmail-content">
                      <h1>
                        {message}
                      </h1>
                      <button type="button" onClick={() => props.resendVerification(props.userEmail)}>
                        <Spinner fetchInProgress={loading} defaultRender={textNode} />
                      </button>
                      <label htmlFor="close-popup">
                        <FontAwesomeIcon className="dashboard-icon" icon="times-circle" />
                      </label>
                      <input
                        onClick={closeNotice}
                        className="opt-none"
                        type="button"
                        id="close-popup"
                      />
                    </div>
                  </div>
            ) : null }
      </div>
    );
};

const PopUpNotification = ({ validation, notificationClassName }) => (
  <div className="dashboard-change-notificaiton">
    <div className={`dashboard-change-content ${notificationClassName}`}>
      <FontAwesomeIcon className="change-icon" icon="save" />
      <h1>{validation.message}</h1>
    </div>
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
                  loading: false,
                  emailNoticeActive: false,
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
            socket.emit('deauthed', Auth.getProfile());
            history.push('/', Auth.logout());
        }

        removeChageNotification = () => {
            this.setState({
                notificationClassName: 'nonactive-class',
            });
            clearTimeout(this.timeOut);
        }

        closeNotice = () => {
            this.setState({
                emailNoticeActive: false,
                validation: {
                    message: null,
                    type: null,
                    code: null,
                  },
            });
        }

        requireVerifiedEmail = (res) => {
            this.setState({
                emailNoticeActive: true,
                validation: {
                    message: res.message,
                    code: res.code,
                    type: res.type,
                },
            });
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

        verifyEmail = (token) => {
            fetch(`/register/verify/${token}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then((res) => {
               this.dataChange(res);
            });
        }

        resendVerification = (email) => {
            this.setState({
                loading: true,
            });

            fetch(`/register/resend/${email}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then((res) => {
                if (res.code === 200) {
                    this.setState({
                        validation: {
                            message: res.message,
                            code: res.code,
                            type: res.type,
                        },
                        loading: false,
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    validation: {
                        message: 'Something went wrong, try again later.',
                        code: err.code,
                        type: err.type,
                    },
                    loading: false,
                });
            });
        }

        render() {
            const {
                validation, user, notificationClassName, loading, emailNoticeActive,
            } = this.state;
             if (user) {
                return (
                  <React.Fragment>
                    <VerifyEmailNotice
                      validation={validation}
                      emailNoticeActive={emailNoticeActive}
                      resendVerification={this.resendVerification}
                      closeNotice={this.closeNotice}
                      userEmail={user.email}
                      loading={loading}
                      textNode={validation.code === 403 ? 'Send Verification' : 'Resend'}
                    />
                    <DashBoardTimeOut
                      validation={validation}
                      initLogout={this.initLogout}
                      {...this.props}
                    />
                    <AuthComponent
                      dataChange={this.dataChange}
                      validation={validation}
                      initLogout={this.initLogout}
                      timeOut={this.expiredNotice}
                      user={user}
                      requireVerifiedEmail={this.requireVerifiedEmail}
                      verifyEmail={this.verifyEmail}
                      {...this.props}
                    />
                    <PopUpNotification
                      notificationClassName={notificationClassName}
                      validation={validation}
                    />
                  </React.Fragment>
                );
            } else {
                return null;
            }
        }
    };
}
