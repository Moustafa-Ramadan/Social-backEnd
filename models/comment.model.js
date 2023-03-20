const mongoose=require('mongoose')

// ## Comments has (content, createdBy=> ref to user model)
let schema=mongoose.Schema({
    content:String,
    createdBy:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user'
    },
    post_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'post'
    }, 
}
, {
    timestamps: true
}
)


module.exports=mongoose.model('comment',schema)
