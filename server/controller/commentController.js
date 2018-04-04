





module.exports = {
    new: (req, res) => {
        console.log(req.body.comment);
        res.end()
    } 
}