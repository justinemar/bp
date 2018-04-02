import React, {Component} from 'react';
import Login from './Login';
import Register from './Register';
import AuthService from '../utils/authService';

export default class Form extends Component{
    constructor(props){
        super(props);
        this.state = {
            defaultForm: true,
            formTextNode: 'Already have an account?'
        }        
        this.Auth = new AuthService;
    }

    
    componentWillMount(){
    if(this.Auth.loggedIn())
        console.log(this.props.history.push('/dashboard'))
    }
    
    toggleForm = () => {
       const state = this.state.defaultForm ? {regis:false, text:"Don't have an account?"} : {regis:true, text:'Already have an account?'};
       console.log(state)
       this.setState({
           defaultForm: state.regis,
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