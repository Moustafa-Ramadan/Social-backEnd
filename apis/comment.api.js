const { auth } = require('../middleWare/authentication/auth')
const { commentValidation } = require('../middleWare/validation/comment.validation')
const { addcomment, updatecomment, deletecomment, commentuser, deletecommentuser, postComments } = require('../services/comment.service')


const app=require('express').Router()

//1=>addcomment
app.post('/addcomment',auth,commentValidation,addcomment)

//2=>updatecomment
app.patch('/updatecomment',auth,commentValidation,updatecomment)

//3=>deletecomment
app.post('/deletecomment',auth,deletecomment)


app.get('/commentuser',auth,commentuser)
app.post('/postComments',auth,postComments)

postComments

//5=>deletecommentuser
app.delete('/deletecommentuser',auth,deletecommentuser)

module.exports=app