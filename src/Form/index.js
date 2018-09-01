import React, {Component} from 'react';
import Login from './Login';
import Register from './Register';
import AuthService from '../utils/authService';

export default class Form extends Component{
    constructor(){
        super();
        this.state = {
            defaultForm: true,
            formTextNode: 'Already have an account?'
        }        
        this.Auth = new AuthService;
    }

    
    componentDidMount(){
    if(this.Auth.loggedIn())
        this.props.history.push('/dashboard')
    }
    
    toggleForm = () => {
       const state = this.state.defaultForm ? 
       { switchFromDefault: false, text:"Don't have an account?" }: 
       { switchFromDefault: true, text:'Already have an account?'};
       
       this.setState({
           defaultForm: state.switchFromDefault,
           formTextNode: state.text
       }) 
    }

    render(){
        const { history } = this.props;
        const { defaultForm, formTextNode } = this.state;
        return (
            <div>
                { defaultForm ?
                    <Register history={history} textNode={formTextNode} toggleForm={this.toggleForm}/> :
                        <Login history={history} textNode={formTextNode} toggleForm={this.toggleForm}/>
                }
            </div>
            
        )
    }
}