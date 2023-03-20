const joi=require('joi')

let commentschema=joi.object({
    post_id:joi.string().min(24).max(24),
    content:joi.string().min(3).max(200).required(),
    createdBy:joi.string().min(24).max(24),
    id:joi.string().min(24).max(24),
})




module.exports.commentValidation=(req,res,next)=>{


const { error} = commentschema.validate(req.body,{abortEarly:false});
if(error){
    res.json(error.details[0].message)
}
else
{
    next()
}
}


// let commentUpdateschema=joi.object({
   
// content:joi.string().min(3).max(200).required(),
//     id:joi.string().min(24).max(24),
// })




// module.exports.commentValidation=(req,res,next)=>{


// const { error} = commentUpdateschema.validate(req.body,{abortEarly:false});
// if(error){
//     res.json(error.details[0].message)
// }
// else
// {
//     next()
// }
// }