const Account  = require("../models/Account");






module.exports = {
    getUser: (req, res) => {
        Account.findOne({_id: req.params.user}, 
            (err, user) => {
                if(err) throw err;
    
                if(user){
                    res.send(user)
                }
            })
        }
}