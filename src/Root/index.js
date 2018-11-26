import React, { Component } from 'react';
import './root.css';
import Form from '../Form/index';


class Root extends Component {
    state = {
        vodBg: '',
    }

    componentDidMount() {
        fetch('https://api.twitch.tv/kraken/clips/top?limit=1&channel=ogaminglol&trending=true', {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.twitchtv.v5+json',
                'Client-ID': 'zpgwoe2990mse921lvv30d93y5rn67',
            },
        }).then(res => res.json())
            .then((res) => {
                const format = res.clips[0].thumbnails.medium.replace('-preview-480x272.jpg', '.mp4');
                this.setState({
                    vodBg: format,
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        const { history } = this.props;
        return (
          <div className="root-wrapper">
            <video id="bg" width="320" height="240" autoPlay loop muted>
              <source src={`${this.state.vodBg}`} type="video/mp4" />
            </video>
            <div className="root-content-container">
              <div className="root-main-content">
                <div className="root-text-wrapper left">
                  <h1> BIDAP </h1>
                  <span>Bidap is a social hub for league of legends players. Socialize with your fellow summoners , watch live league of legends streams , find the right duo and boast your league profile</span>
                </div>
                <div className="root-form-wrapper right">
                  <Form history={history} />
                </div>
              </div>
            </div>
          </div>
        );
    }
}


export default Root;
