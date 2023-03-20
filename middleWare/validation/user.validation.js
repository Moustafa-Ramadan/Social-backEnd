const joi=require('joi')


let method=['body','params']

let schema={
body:joi.object({
    name:joi.string().min(3).max(15).required(),
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password:joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    repassword:joi.ref('password'),
    age:joi.number().min(16).max(60).required(),
    phone:joi.string().pattern(/^(02)?[0-9]{11}/).required(),
    
}),
params:joi.object({
    id:joi.string().min(24).max(24)
}),
}



module.exports.userValidation=(req,res,next)=>{
    let errmessages=[]
method.map((key)=>{
    const { error} = schema[key].validate(req[key],{abortEarly:false});
    if(error){
       error.details.map((msg)=>{
       errmessages.push({message:msg.message})
        })
         }
 })

if(errmessages.length>0){
    res.json(errmessages)
}
else
{
    next()
}


    

}



let emailschema=joi.object({
        
          oldEmail:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
          email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
          password:joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
})



module.exports.emailValidation=(req,res,next)=>{
    

    const { error} = emailschema.validate(req.body,{abortEarly:false});
    if(error){
        res.json(error.details)
    }
    else
    {
        next()
    }
 }



 //signin validation
 let signinschema=joi.object({
        
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password:joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
})



module.exports.signinValidation=(req,res,next)=>{


const { error} = signinschema.validate(req.body,{abortEarly:false});
if(error){
    res.json(error.details)
}
else
{
    next()
}
}



 let passwordschema=joi.object({
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    oldpassword:joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),        
    password:joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
    repassword:joi.ref('password'),
    acode:joi.string()

})



module.exports.passwordValidation=(req,res,next)=>{


const { error} = passwordschema.validate(req.body,{abortEarly:false});
if(error){
    res.json(error.details)
}
else
{
    next()
}
}


let resetPasswordschema=joi.object({
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password:joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
    acode:joi.string()

})



module.exports.resetPasswordValidation=(req,res,next)=>{


const { error} = resetPasswordschema.validate(req.body,{abortEarly:false});
if(error){
    res.json(error.details)
}
else
{
    next()
}
}




let deleteUserSchema=joi.object({
         
    password:joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
   

})



module.exports.deleteUserValidation=(req,res,next)=>{


const { error} = deleteUserSchema.validate(req.body,{abortEarly:false});
if(error){
    res.json(error.details)
}
else
{
    next()
}
}