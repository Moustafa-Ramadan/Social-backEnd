module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500
    if(process.env.MODE_ENV === "development"){
        devMode(err,res)
    }else{
        prodMode(err,res) 
    }

}


let prodMode=(err,res)=>{
   return res.json({status:err.statusCode,msg:err.message})
//    return res.status(err.statusCode).json({status:err.statusCode,msg:err.message})


}

let devMode=(err,res)=>{
  return res.json({status:err.statusCode,msg:err.message ,err,stack:err.stack})
  

}

