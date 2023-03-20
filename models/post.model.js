const mongoose=require('mongoose')

let schema=mongoose.Schema({
    content:String,
    image:{
        type:String,
        default:''
    },
    createdBy:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
        },
    upAndDown:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
    },
    count:{
        type:Number,
        default:0,
    },
    comments:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'comment'
    }],
}, {
    timestamps: true
})
module.exports=mongoose.model('post',schema)

