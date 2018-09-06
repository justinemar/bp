import React, { Component } from 'react';
import AuthService from './authService';




const DashBoardTimeOut = ({validation, initLogout}) => {
    return (
        <div>
        { validation.code === 401 ? 
                <div className="dashboard-timeout">
                    <div className="dashboard-timeout-content">
                            <h1> {validation.message} </h1>
                            <button onClick={() => initLogout()}> Login to continue </button>
                    </div>
                </div> : null }  
        </div>
    );
};


export default function withAuth(AuthComponent) {

    const Auth = new AuthService();
    return class AuthWrapped extends Component {
        constructor() {
            super();
            this.state = {
                user: null,
                validation: {
                    message: null,
                    type: null,
                    code: null
                  },
            };
        }
        componentWillMount() {
        if (!Auth.loggedIn()) {
            this.props.history.replace('/');
        }
        else {
            try {
                const profile = Auth.getProfile();
                this.setState({
                    user: profile
                });
            }
            catch(err){
                Auth.logout();
                this.props.history.replace('/');
                }
            }
        }
        
        updateUser = (token) => {
            Auth.setToken(token);
            const profile = Auth.getProfile();
            this.setState({
                user: profile
            });
        }
        
        expiredNotice = (res) => {
            this.setState({
                validation: {
                    message: res.message,
                    type: res.type,
                    code: res.code
                }
            });
        }

        initLogout = () => {
            this.props.history.push('/', Auth.logout());
        }
    
       
        render() {
            if (this.state.user) {
                return (
                    <React.Fragment>
                        <DashBoardTimeOut validation={this.state.validation} initLogout={this.initLogout} {...this.props}/>
                        <AuthComponent timeOut={this.expiredNotice} updateUser={this.updateUser} history={this.props.history} user={this.state.user} {...this.props}/>
                    </React.Fragment>
                );
            }
            else {
                return null;
            }
        }        

    };
}