const cloudinary = require("cloudinary");
require('dotenv').config();


exports.config = {
    cloudinary: 
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        }), 
    twitch_client_id: process.env.TWITCH_CLIENT_ID
}
