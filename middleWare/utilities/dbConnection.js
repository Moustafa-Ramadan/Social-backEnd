const mongoose=require('mongoose')


module.exports.dbConnection=()=>{
    mongoose.connect(process.env.DB_STRONG).then(()=>{
        console.log("db connection established")
    }).catch((err)=>{
        console.log(err); 
    })

}