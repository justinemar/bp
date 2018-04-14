const Account = require('../models/Account');



const accountWares = {
    checkUser: function(req, res, next){
        const filter = req.body.email || req.body.user_id
        Account.findOne({user_email: filter}, function(err, user) {
            if(err) { 
                console.error(err)
                res.status(500).json({message: 'Internal Server Error'})
            };
            
            if(user && req.body.email) {
                res.json({
                    message: 'Account email address already exists!',
                    type: 'error'
                })
            } else if(user && req.body.user_id) {
                res.send(user)
            
            } else {
                next();
            }
        })
    },

}

module.exports = accountWares;