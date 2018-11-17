const jwt = require('jsonwebtoken');
const Account = require('../../models/Account');
require('dotenv').config();


 module.exports = {
    setToken: payload => jwt.sign(payload, process.env.KEY1, {
                  expiresIn: 1800, // expires in 30 minutes
     }),

    broadCast: (action, user, cb) => {
       switch (action) {
         case 'auth':
         Account.findByIdAndUpdate({ _id: user.id }, { $set: { online: true } }, { new: true },
            (err, data) => {
               if (err) {
                  return cb(err);
               }

               return cb(null, data);
         });
         break;
         case 'deauth':
         Account.findByIdAndUpdate({ _id: user.id }, { $set: { online: false } }, { new: true },
            (err, data) => {
               if (err) {
                  return cb(err);
               }
               return cb(null, data);
         });
         break;
         default:
            console.log('something');
       }
    },
};
