const { uploadimg } = require('../commen/uploadimg')
const { auth } = require('../middleWare/authentication/auth')
const { postValidation } = require('../middleWare/validation/post.validation')
const { addpost, updatepost, allpost, deletepost, userposts, upAndDown} = require('../services/post.services')



const app=require('express').Router()

//1=>addpost
app.post('/addpost',auth,postValidation,uploadimg("image"),addpost)
//2=>updatepost
app.patch('/updatepost',auth,postValidation,updatepost)

//3=>allpost
app.get('/allposts',auth,allpost)

//4=>userposts
app.get('/userposts',auth,userposts)
//5=>deletepost
app.post('/deletepost',auth,deletepost)

app.patch("/upAndDown",auth,upAndDown)
// //6=>deleteallposts
// app.delete('/deleteallposts',auth,deleteallposts,)

module.exports=app