const fetch = require('node-fetch');
const { twitchClientID } = require('../../helpers/config').config;


module.exports = {
    getStreams: (req, res) => {
        fetch(`https://api.twitch.tv/kraken/streams/?client_id=${twitchClientID}&game=League%20of%20Legends&stream_type=live`, {
            method: 'GET',
        })
        .then(data => data.json())
        .then((data) => {
            res.json({
                code: 200,
                data,
            });
        })
        .catch(err => console.log(err));
    },
};
