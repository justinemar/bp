import React, { Component } from 'react';
import AuthService from './authService';







export default function withAuth(AuthComponent) {

    const Auth = new AuthService();
    return class AuthWrapped extends Component {
        constructor() {
            super();
            this.state = {
                user: null
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
        
        render() {
            if (this.state.user) {
                return (
                    <AuthComponent updateUser={this.updateUser} history={this.props.history} user={this.state.user} {...this.props}/>
                );
            }
            else {
                return null;
            }
        }        

    };
}