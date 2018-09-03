import React, { Component } from 'react';
import './root.css';
import Form from '../Form/index';



class Root extends Component{

    
    render(){
        const { history } = this.props;
        return (
                <div className="root-wrapper">
                    <div className="root-content-container">
                        <div className="root-main-content">
                            <div className="root-text-wrapper left">
                                <h1> PLACEHOLDER </h1>
                                <span>Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
sed diam nonummy nibh euismod tincidunt ut laoreet dolore
magna aliquam erat volutpat.</span>
                            </div>
                            <div className="root-form-wrapper right">
                                <Form history={history}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
}


export default Root;


