const joi=require('joi')

let postschema=joi.object({
content:joi.string().min(3).max(200),
post_id:joi.string().min(24).max(24),
createdBy:joi.string().min(24).max(24),
image:joi.string(),

})




module.exports.postValidation=(req,res,next)=>{

    let errmessages=[]
const { error} = postschema.validate(req.body,{abortEarly:false});
if(error){
    error.details.map((msg)=>{
        errmessages.push({message:msg.message})
         })
          }


if(errmessages.length>0){
    res.json(errmessages)
}
else
{
    next()
}

}



