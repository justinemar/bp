import React from 'react';





class UserProfile extends React.Component{
    
    state = {
        profile: null
    }
    
    componentDidMount(){
        const userID = this.props.match.params.user
        fetch(`/users/${userID}`, {
            method: "GET",
            credentials: 'same-origin'
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                profile: res
            })
        })
        .catch(err => console.error(err))
    }
    
    render(){
        const { profile } = this.state;
        const user_email = profile ? profile.user_email : null;
        return (
            <div className="section-selected-tab">
                <div className="header">
                    <h1>{user_email}</h1>    
                </div>
            </div>
        )
    }
}


export default UserProfile;