const usermodel=require('../models/user.model')

const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {nanoid}=require('nanoid')
const { sendemail } = require('../emails/user.email')
const commentModel = require('../models/comment.model')
const postModel = require('../models/post.model')
const app = require('../apis/user.api')
const AppError = require('../middleWare/utilities/AppError')
const { catchAsyncError } = require('../middleWare/utilities/catchAsync')

const cloudinary=require('cloudinary')
// const asyncHandler = require('express-async-handler')

cloudinary.config({ 
    cloud_name: 'dtm4kmm5s', 
    api_key: '273764512386596', 
    api_secret: 'j7n1Anjf0axpKeHnAeX1smcAk0U' 
  });



// ## 1- sign in (send token)
module.exports.Signin=catchAsyncError(async(req,res,next)=>{
    const{email,password}= req.body
   
    const user=await usermodel.findOne({email})
    if(user){
        const match = await bcrypt.compare(password, user.password);
        if(match){
let token=jwt.sign({ id:user._id,password:user.password ,email:user.email,name:user.name,image:user.image }, process.env.kEY);

if(user.emailconfiem==true){
    await usermodel.findByIdAndUpdate(user._id,{isOnline:true})
    res.json({message:"success",token})
}
else
{
    next(new AppError("please verify your email first",501))
    
}
            
        }
        else
        {
            next(new AppError("incorrect password",400))
           
        }
       
    }
    else
    {
      
        next(new AppError("email doesn't exist",404))

    }
   
   
   }
) 


//logout
module.exports.Logout=catchAsyncError(async(req,res,next)=>{
    
     const user=   await usermodel.findByIdAndUpdate(req.id,{isOnline:false})
        res.json({message:"success",user})  
   
   }
) 


// ## 2- sign up (hash password)

module.exports.Signup= catchAsyncError(async(req,res,next)=>{
    const{name,email,password,age,phone}= req.body
    const user= await usermodel.findOne({email})
    if(user){
         next(new AppError("email already exist",404))
        //  res.json({message:"email already exist"})
    }
    else
    {
      
           bcrypt.hash(password,4,async function(err, hash) {
               await usermodel.insertMany({name,email,password:hash,age,phone})
               let token=jwt.sign({email},'moram',{ expiresIn:60*60 })
               sendemail({email,token,message:"hallo"})
               res.json({message:"success"})
           });
      
     
       
       
    }
   
   
   })


// ## 3-Change password  (user must be logged in)(Get user ID from token)

module.exports.changepassword=catchAsyncError(async(req,res,next)=>{

    const{password,oldpassword}= req.body
    const isPassword=await bcrypt.compare(oldpassword, req.password);
    if(isPassword){
        const match = await bcrypt.compare(password, req.password);
        if(match){
         next(new AppError("it is the same password",400))
        }
        else
        {
            bcrypt.hash(password,4,async function(err, hash) {
               
                await usermodel.updateOne({_id:req.id},{password:hash})
        res.json({message:'success'})
            });
        
        
        }
    }
    else
    {
        next(new AppError("the current password incorrect",400))
    }


})


// ## 4- update account   (user must be logged in)(Get user ID from token)

module.exports.updateAccount=catchAsyncError(async(req,res,next)=>{

    const{oldEmail,email,password}= req.body
    const isPassword=await bcrypt.compare(password, req.password);
    if(oldEmail==req.email && isPassword){
        let useremail=await usermodel.findOne({email})
        console.log(useremail);
    if( useremail){
        next(new AppError("email is already exist ,choose another one",400))
    }
    else
    {   
       await usermodel.updateOne({_id:req.id},{email,emailconfiem:false})
       let token=jwt.sign({email},'moram',{ expiresIn:60*60 })
       sendemail({email,token,message:"hallo"})
        res.json({message:'success'})
     }
    }
    else
    {   
        next(new AppError("email or password incorrect",400))
     }
    
})

// ## 5- delete account (with posts and comments created by this account) (user must be logged in)(Get user ID from token)


module.exports.deleteuser=catchAsyncError(async(req,res,next)=>{
 const{password}=req.body
 const match=await bcrypt.compare(password, req.password);
 if(match){
    await postModel.deleteMany({createdBy:req.id}).populate('createdBy')
    await commentModel.deleteMany({createdBy:req.id}).populate('createdBy')
    await usermodel.deleteOne({_id:req.id})
  
      res.json({message:"success"})
 }
 else
 {
    next(new AppError("password incorrect",400))
 }
    
      
  })



//6-verify email
module.exports.verifiedemail=catchAsyncError(async(req,res,next)=>{
    const{token}=req.params

    jwt.verify(token,'moram',async(err,decoded)=>{
if(err){
    res.json(err)
}
else{
    const user=await usermodel.findOne({email:decoded.email})
    if(user){

        await usermodel.findOneAndUpdate({email:decoded.email},{emailconfiem:true})
        res.json({message:"verified"})
    }
    else
    {
        next(new AppError("user not found",404))
    }
}

    })
   
})

//7-activation code

module.exports.activationCode=catchAsyncError(async(req,res,next)=>{
    const{email}=req.body
    const user=await usermodel.findOne({email})
    if(user){
        const acode=nanoid(6)
        const message=`<p style="background-color:#222;color:#fff,padding:10px">${acode}</p>`
        sendemail({email,message})
        await usermodel.findOneAndUpdate({email},{acode:acode})
        res.json({message:"success"})
    }
    else
    {
        next(new AppError("email already exist",404))
    }
   

    })


//8-forget password

module.exports.forgetpassword=catchAsyncError(async(req,res,next)=>{
    const{email,acode,password}=req.body 
    const user=await usermodel.findOne({email})
    if(user.acode==acode){
    
    bcrypt.hash(password,4,async function(err, hash) {
        const acode=nanoid(6)
        await usermodel.updateOne({email},{password:hash,acode:acode})
    res.json({message:'success'})
    });
    }
    else
    {
    next(new AppError("in-valid code",400))
    }
    
    })



//9-update pic-Profile

module.exports.updateprofilepicture=catchAsyncError(async(req,res,next)=>{

    if(req.file){
        cloudinary.v2.uploader.upload(req.file.path,
            async(error, result)=> {
          req.body.image=result.secure_url
           let user=await usermodel.findByIdAndUpdate(req.id,{image:result.secure_url},{new:true});
         res.status(200).json({message:'success',user})
          
          console.log(result); });
      
          
    }else
    {
        next(new AppError("image only",400))
    }

    
})

//10=>all users

module.exports.allusers=catchAsyncError(async(req,res,next)=>{

    const users=  await usermodel.find({})
    res.json({message:"success",users})
})

//11=>user's profile
module.exports.userProfile=catchAsyncError(async(req,res,next)=>{
const {_id}=req.params
   
const user=  await usermodel.findById(_id)
const userPosts=  await postModel.find({createdBy:_id}).populate([{path:'createdBy', select: 'name image'},{path:'comments',   populate : {
    path : 'createdBy',
    select: 'name'
  } }])
    res.json({message:"success",user,userPosts})
})

//12=>send follow request

module.exports.sendFollow=catchAsyncError(async(req,res,next)=>{
    const {userId}=req.body

    const user=await usermodel.findById(userId)
    if(user){
        const userToFollow=await usermodel.findOne({userId,followers:{$in:[req.id]}})
        if(userToFollow){
            await usermodel.findByIdAndUpdate(userId,
                {$pull:{followers:req.id}})
                await usermodel.findByIdAndUpdate(req.id,
                    {$pull:{following:userId}})
            res.json({message:"success",follow:false,user})
        }
        else
        {
            await usermodel.findByIdAndUpdate(userId,
                {$push:{followers:req.id}})
                await usermodel.findByIdAndUpdate(req.id,
                    {$push:{following:userId}})
            res.json({message:"success",follow:true,user})
        }
    }
    else
    {
        next(new AppError("this user maybe deleted",404))
        
    }
    
    }
    )
    
//13=>get all followers
    module.exports.allFollowers=catchAsyncError(async(req,res,next)=>{
        // const {id}=req.params
    
        
          const user= await usermodel.findById(req.id).populate([{path:"followers",select:"name image"},
          {path:"following",select:"name image"},
          {path:"friends",select:"name image"},
          {path:"requests",select:"name image"}])
                res.json({message:"success",user})
       
        
    }
        )

//14=>send friend request
module.exports.friendRequest=catchAsyncError(async(req,res,next)=>{
    const {userId}=req.body

    const user=await usermodel.findById(userId)
    if(user){
        const userRequest=await usermodel.findOne({userId,requests:{$in:[req.id]}})
      

        

        if(userRequest ){
            const userData= await usermodel.findByIdAndUpdate(userId,
               {$pull:{requests:req.id}},{new:true})   
            res.json({message:"success",Request:false,userData})
        }
        else
        {
            const isFriend=await usermodel.findOne({userId,friends:{$in:[req.id]}})
            if(isFriend === true){
                next(new AppError("this user is a friend with you",404))
            }
            else
            {
                const userData=  await usermodel.findByIdAndUpdate(userId,
                    {$push:{requests:req.id}},{new:true})
                    
                res.json({message:"success",Request:true,userData,userdata2})
            }
          
        }
    }
    else
    {
        next(new AppError("this user maybe deleted",404))
        
    }
    
   
    
}
    )

//15=>Get all friends requests
module.exports.FriendsRequests=catchAsyncError(async(req,res,next)=>{
    const  friendreq=await usermodel.findById(req.id).populate({path:"requests",select:"name image"})
    res.json({message:"success",friendreq})
}
    )


//16=>confirm friend request
    module.exports.confirmFriendRequest=catchAsyncError(async(req,res,next)=>{
        const {userId}=req.body
        const user=await usermodel.findById(userId)
        if(user){
                const userData1= await usermodel.findByIdAndUpdate(req.id,
                   {$pull:{requests:userId},$push:{friends:userId}},{new:true})   
                   const userData2= await usermodel.findByIdAndUpdate(userId,
                    {$push:{friends:req.id}},{new:true})   
                res.json({message:"success",confirm:true,userData1,userData2})
        
        }
        else
        {
            next(new AppError("this user may be deleted",404))
            
        }
        
       
        
    }
        )

//17=>Get all online friends
module.exports.onlineFriends=catchAsyncError(async(req,res,next)=>{
    const  friendsList=await usermodel.findById(req.id).populate({path:"friends",select:"name image isOnline"})
    const onlinefriends=friendsList.friends.filter((friend)=>{return friend.isOnline==true}) 
    res.json({message:"success",onlinefriends,friendsList})
}   
    )        

//18=>dismiss friend request
    module.exports.dismissFriendRequest=catchAsyncError(async(req,res,next)=>{
        const {userId}=req.body
        const user=await usermodel.findById(userId)
        if(user){
                const userData= await usermodel.findByIdAndUpdate(req.id,
                   {$pull:{requests:userId}},{new:true})   
                res.json({message:"success",dismiss:true,userData})
        
        }
        else
        {
            next(new AppError("this user may be deleted",404))
            
        }
        
       
        
    }
        )

 //19=>delete friend from friend's list
 module.exports.deleteFriend=catchAsyncError(async(req,res,next)=>{
    const {userId}=req.body

            const userData1= await usermodel.findByIdAndUpdate(req.id,
               {$pull:{friends:userId}},{new:true})  
               const userData2= await usermodel.findByIdAndUpdate(userId,
                {$pull:{friends:req.id}},{new:true})  
            res.json({message:"success",delete:true,userData1,userData2})
    
   
    
   
    
}
    )       

    //20=>follow status
 module.exports.followStatus=catchAsyncError(async(req,res,next)=>{
           const {userId}=req.body
            const Status=await usermodel.findOne({userId,followers:{$in:[req.id]}}) 
            if(Status){
                const user= await usermodel.findById(userId).populate([{path:"followers",select:"name image"}])
                res.json({message:"success",followStat:true,user})
            }
            else
            {
                res.json({message:"success",followStat:false})
            }
        
    
}
    )  


       //20=>friend status
 module.exports.friendsStatus=catchAsyncError(async(req,res,next)=>{
          const {userId}=req.body

          const user=await usermodel.findById(userId)
          if(user){
            const friStatus=await usermodel.findOne({_id:req.id,friends:{$in:[userId]}})
            
            
            if(friStatus){
                const userdata= await usermodel.findById(req.id).populate([{path:"friends",select:"name image"}])
                res.json({message:"success",friend:true,userdata})
            }else{
                const requestStatus=await usermodel.findOne({_id:req.id,requests:{$in:[userId]}}) 
             
                if(requestStatus){
                const user= await usermodel.findById(req.id).populate([{path:"requests",select:"name image"}])
                const userdata2= await usermodel.findById(userId).populate([{path:"requests",select:"name image"}])
                
                res.json({message:"success",requestStatus:true,user,userdata2})
                }
                else
                {
                    res.json({message:"success",requestStatus:false})
                }
            }
            
          }
          else
          {
            next(new AppError("this user may be deleted",404))
          }
           
}
    )  



    //21=>search 

    module.exports.search=catchAsyncError(async(req,res,next)=>{
      const {keyword}=req.body
       const users= await usermodel.find( {name:{$regex:keyword,$options:"i"} }).select("name image")
           
       res.json({message:"success",users})
 
  
}
  ) 

  