import React from 'react';



class Resend extends React.Component{

    state = {
        res: {
            message: null
        }
    }
    componentDidMount(){
        fetch(`/register/resend/${this.props.match.params.email}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                res: res
            })
        })
    }


    render(){
        return(
            <div id="message">{this.state.res.message}</div>            
        )
    }
}

export default Resend