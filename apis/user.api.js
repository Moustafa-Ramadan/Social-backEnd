const { uploadimg } = require('../commen/uploadimg')
const { auth } = require('../middleWare/authentication/auth')
const { userValidation, emailValidation, passwordValidation, signinValidation, deleteUserValidation, resetPasswordValidation } = require('../middleWare/validation/user.validation')
// const { deletecommentuser } = require('../services/comment.service')
const { Signin, Signup, changepassword, updateAccount, deleteuser,verifiedemail, activationCode, forgetpassword, allusers, updateprofilepicture, userProfile, sendFollow, allFollowers, friendRequest, FriendsRequests, confirmFriendRequest, allFriends, dismissFriendRequest, deleteFriend, followStatus, friendsStatus, Logout, onlineFriends, search} = require('../services/user.service')

const app=require('express').Router()

//1=>Signup
app.post('/Signup',userValidation,Signup)

//2=>Signin
app.post('/Signin',signinValidation,Signin)

//2=>logout
app.get('/Logout',auth,Logout)

//3=>changepassword

app.patch('/changepassword',auth,passwordValidation,changepassword)

//4=>updateAccount
app.patch('/updateAccount',auth,emailValidation,updateAccount)

//5=>deleteAccount

app.post('/deleteuser',auth,deleteUserValidation,deleteuser)

//6=>Email Confirm

app.get("/confirm/:token", verifiedemail)

//7=>activationCode

app.post("/activationCode",activationCode)

//8=>forget password


app.patch("/forgetpassword",resetPasswordValidation,forgetpassword)

//9=>update profile picture

app.patch("/updateprofilepicture",auth,uploadimg("image"),updateprofilepicture)

//10=>get all users

app.get("/allusers",allusers)
//11=>user's profile
app.get("/userProfile/:_id",auth,userProfile)

//12=>send follow request
app.post("/sendFollow",auth,sendFollow)

//13=>get all followers
app.get("/allFollowers",auth,allFollowers)

//  //14=>send friend Request
app.post("/friendRequest",auth,friendRequest)

//15=>get all friends Request
app.get("/FriendsRequests",auth,FriendsRequests)

//16=>confirmFriendRequest

app.post("/confirmFriendRequest",auth,confirmFriendRequest)

//17=>get all online Friends 
app.get("/onlineFriends",auth,onlineFriends)

//18=>dismiss friend request
app.post("/dismissFriendRequest",auth,dismissFriendRequest)

//19=>delete friend from friend's list
app.post("/deleteFriend",auth,deleteFriend)

//20=>follow status
app.post("/followStatus",auth,followStatus)

//21=>friends Status
app.post("/friendsStatus",auth,friendsStatus)

app.post('/search',search)

module.exports=app