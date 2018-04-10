





module.exports = {
    new: (req, res) => {
        console.log(req.body.comment);
        res.json({
            message: 'comment posted',
            type: 'success',
            code: 200
        })
    } 
}