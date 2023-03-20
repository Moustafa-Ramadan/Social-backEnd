
const jwt=require('jsonwebtoken')




module.exports.auth=(req,res,next)=>{
    const token=req.header('token')
    jwt.verify(token, 'mostafaramadan', function(err, decoded) {
        if(err){
            res.json(err)
        }else
        {
            req.id=decoded.id
            req.password=decoded.password
            req.email=decoded.email
            next()
        }

      });
}