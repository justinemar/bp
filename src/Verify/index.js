import React from 'react';



class Verify extends React.Component{

    state = {
        res: {
            message: null
        }
    }
    componentDidMount(){
        fetch(`/register/verify/${this.props.match.params.token}`, {
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

export default Verify