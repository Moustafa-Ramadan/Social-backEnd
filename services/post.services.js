const commentModel = require('../models/comment.model')
const postmodel=require('../models/post.model')
// const AppError = require('../middleWare/utilities/AppError')
const { catchAsyncError } = require('../middleWare/utilities/catchAsync')
const AppError = require('../middleWare/utilities/AppError')

const cloudinary=require('cloudinary')
// const asyncHandler = require('express-async-handler')

cloudinary.config({ 
    cloud_name: 'dtm4kmm5s', 
    api_key: '273764512386596', 
    api_secret: 'j7n1Anjf0axpKeHnAeX1smcAk0U' 
  });


// ## 1- add post  (user must be logged in)(Get user ID from token)

module.exports.addpost=catchAsyncError(async(req,res,next)=>{

   
    if(!req.file){
        const{content}=req.body
            req.body.createdBy=req.id
             let post=new postmodel(req.body);
                await post.save();
                res.status(200).json({message:'success',post})
    }
    else
    {
        if(req.file){
            cloudinary.v2.uploader.upload(req.file.path,
                async(error, result)=> {
              const{content}=req.body
              req.body.createdBy=req.id
              req.body.image=result.secure_url
               let post=await postmodel.insertMany({content,createdBy:req.id,image:result.secure_url});
                //   await post.save();
                  res.status(200).json({message:'success',post})
              
              console.log(result); });
          
              
        }else
        {
            next(new AppError("image only",400))
        }
    }
   


    
   
   
// if(req.file){
//     cloudinary.v2.uploader.upload(req.file.path, 
//         async(error, result)=>{
//           console.log(result); 
//           const{content}=req.body
//           await postmodel.insertMany({image:result.secure_url,content:content})
//           res.json({message:"success"})
//       });
   
// }
// else{
// next(new AppError("image only",400))
// }
  
// await postmodel.insertMany({content,createdBy:req.id})
//     res.json({message:"success"})

})

// ## 2- update post  (user must be logged in)(Get user ID from token) (post owner only)


module.exports.updatepost=catchAsyncError(async(req,res,next)=>{
    const {post_id,content}=req.body
    const post=await postmodel.findById(post_id)
     if(req.id==post.createdBy._id){
        await postmodel.updateOne({_id:post_id},{content})
        res.json({message:"success"})
    
    }else{
        next(new AppError("you ara not authorized to edit this post",501))
    
    }
    })
    
    

     

// ## 3- Get all posts (with created by details and comments details using populate) (user must be logged in) >>>problem


module.exports.allpost=catchAsyncError(async(req,res,next)=>{ 
    let posts  = await postmodel.find().populate([{path:'createdBy', select: 'name image' }
    ,{path:'comments', select:'content' }])

    
     let counts = await postmodel.find().populate([{path:'createdBy', select: 'name image' }
     ,{path:'comments', select:'content' }])
        res.json({message:"success",counts,posts})
    
    })


    
    // ## 4- Get user posts (with created by details and comments details using populate) (user must be logged in)(Get user ID from token)

    module.exports.userposts=catchAsyncError(async(req,res,next)=>{
        let posts = await postmodel.find({createdBy:req.id}).populate([{path:'createdBy', select: 'name image'},{path:'comments',   populate : {
            path : 'createdBy',
            select: 'name'
          } }])
        let counts = await postmodel.find({createdBy:req.id}).populate([{path:'createdBy', select: 'name'},{path:'comments', select:'content createdBy' }]).count()
            res.json({message:"success",counts,posts})
        //    req.id=posts._id
        //     next()
        
        }
)


// ## 5- Delete Post  (user must be logged in)(Get user ID from token) (post owner only)

module.exports.deletepost=catchAsyncError(async(req,res,next)=>{
    const {post_id}=req.body
  const post= await postmodel.findById(post_id).populate("comments")
  console.log(post)
        if(req.id==post.createdBy){
            post.comments.forEach(async (comment) => {
                await commentModel.findByIdAndDelete(comment._id);
            });
        await postmodel.deleteOne({_id:post_id})
        res.json({message:"success",post})
        post.post_id=post_id
        
         }else{
            next(new AppError("you are not authorized to edit this post",501))
        }
        })
    
   

//like and unlike

module.exports.upAndDown=catchAsyncError(async(req,res,next)=>{
const {post_id}=req.body

const post=await postmodel.findById(post_id)
if(post){
    const userpost=await postmodel.findOne({post_id,upAndDown:{$in:[req.id]}})
    if(userpost){
        await postmodel.updateOne({post_id},
            {$inc:{count:-1},
            $pull:{upAndDown:req.id}})
        res.json({message:"success",like:false})
    }
    else
    {
        await postmodel.updateOne({post_id},
            {$inc:{count:1},
            $push:{upAndDown:req.id}})
        res.json({message:"success",like:true})
    }
}
else
{
    next(new AppError("there is no post here",404))
    
}

}
)



module.exports.getlikes=catchAsyncError(async(req,res,next)=>{ 
    const {post_id}=req.body
    let usersLikes = await postmodel.findOne({post_id,upAndDown:{$in:[req.id]}})
    if(usersLikes){
        res.json({message:"success",like:true,usersLikes})
    }
    else
    {
        res.json({message:"success",like:false,usersLikes})
    }
        
    
    })



