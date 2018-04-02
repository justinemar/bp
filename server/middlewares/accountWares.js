const Account = require('../models/Account');



const accountWares = {
    checkUser: function(req, res, next){
        console.log('1')
        Account.findOne({user_email: req.body.email}, function(err, user) {
            if(err) { 
                console.error(err)
                res.status(500).json({message: 'Internal Server Error'})
            };
            
            if(user) {
                res.json({
                    message: 'Account email address already exists!',
                    type: 'error'
                })
            } else {
                next();
            }
        })
    },

}

module.exports = accountWares;