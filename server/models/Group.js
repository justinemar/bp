const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const GroupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: 'Tell more about your group..',
    },
    members: [{
        identity: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        role: {
            type: String,
            default: 'Member',
        },
        _id: false,
    }],
    logo: {
        default: 'https://res.cloudinary.com/dhwgznjct/image/upload/v1541439035/defaultlogo_ah1zw3.png',
        type: String,
    },
    public: {
        type: Boolean,
    },
});


const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
