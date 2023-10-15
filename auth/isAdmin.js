const { verify } = require('jsonwebtoken');

const isAdmin = (req,res, next) =>{
    let getToken = req.get("authorization");
    if (!getToken) {
        return res.status(404).json({message: "Access falid..."});
    } else {
        getToken = getToken.slice(7);
        verify(getToken, process.env.JSONSECREAT,(err,decoded)=>{
            if (err) {
                return res.status(404).json({message: "Invaid token, try again..."});
            } else {
                if (decoded.result.roles[0].role === "Admin") {
                    next();
                } else {
                   return res.status(406).json({message: "Youe are not admin..."});
                }
            }
        })
    }
};

module.exports = { isAdmin }