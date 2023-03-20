
const AppError = require('../middleWare/utilities/AppError')
const { catchAsyncError } = require('../middleWare/utilities/catchAsync')
const commentmodel=require('../models/comment.model')
const postModel = require('../models/post.model')

// ## 1- Add Comment  (user must be logged in)(Get user ID from token)
module.exports.addcomment=catchAsyncError( async(req,res,next)=>{

    const{content,post_id}=req.body
    const isPosted=await postModel.findById(post_id)
    console.log(isPosted)
    if(isPosted){
        const addedComment =  await commentmodel.insertMany({content,createdBy:req.id,post_id})
        const newComment = await commentmodel.findById(addedComment[0]._id).populate('createdBy')
        
        // const post = await postModel.findOne(post_id)
        // post.comments.push(addedComment[0]._id)
        const post = await postModel.findByIdAndUpdate(post_id,{$push:{comments:addedComment[0]._id}})
        // post.save()
        res.json({message: "success", newComment})
    }
    else
    {
        next(new AppError("there is no post here",404))   

    }
    

})


// ## 2- Update comment (user must be logged in)(Get user ID from token) (post owner only)




module.exports.updatecomment=catchAsyncError(async(req,res,next)=>{
    const{content,id}=req.body
    const comment=await commentmodel.findById(id) 
    console.log(comment)
if(req.id==comment.createdBy){
    await commentmodel.updateOne({_id:id},{content})
    res.json({message:"success"})
}else{
    next(new AppError("you ara not authorized to edit this comment",501))   
}
})
    
 


// ## 3- Delete comment (user must be logged in)(Get user ID from token) (comment owner and post owner)


module.exports.deletecomment=catchAsyncError(async(req,res,next)=>{
    const{id}=req.body
const comment=await commentmodel.findById(id)
console.log(req.id+'=='+ comment.createdBy)
if(req.id==comment.createdBy){
    const post = await postModel.findByIdAndUpdate(comment.post_id,{$pull:{comments:comment._id}})
    await commentmodel.deleteOne({_id:id})
    res.json({message:"success"})
}else{
    next(new AppError("you ara not authorized to delete this comment",501))   
}
})



module.exports.commentuser=catchAsyncError(async(req,res,next)=>{

    let comments = await commentmodel.find({createdBy:req.id}).populate('createdBy' ,'name')
        let counts = await commentmodel.find({createdBy:req.id}).populate('createdBy','name').count()
            res.json({message:"success",counts,comments})

        
})


module.exports.postComments=catchAsyncError(async(req,res,next)=>{
const{post_id}=req.body
    let comments = await commentmodel.find({post_id}).populate([{path:'createdBy', select: 'name image' }
    ,{path:'post_id', select:' createdBy comments' }])
        let counts =await commentmodel.find({post_id}).populate('post_id').count()
            res.json({message:"success",counts,comments})

})



module.exports.deletecommentuser=catchAsyncError(async(req,res)=>{
           
const usercomments= await commentmodel.deleteMany({createdBy:req.id}).populate('createdBy')
    res.json({message:"success"})
    
    
}
)


