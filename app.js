process.on("uncaughtException",(err)=>{
    console.log("uncaughtException",err)
})
const express = require('express')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000
const morgan=require("morgan")
const cors=require('cors')
const AppError = require('./middleWare/utilities/AppError')
const Globalmiddleware = require('./middleWare/utilities/Globalmiddleware')
const { dbConnection } = require('./middleWare/utilities/dbConnection')
app.use(cors())
app.use(express.json())

if(process.env.MODE_ENV === "development"){
    app.use(morgan("dev"))
}

  
app.use(express.static('uploads'))
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/comments',require('./apis/comment.api'))
app.use('/users',require('./apis/user.api'))
app.use('/posts',require('./apis/post.api'))

app.all("*",(req,res,next)=>{

    // res.status(404).json({msg:`can't find this route ${req.originalUrl} on server`})
    
    // let err=new Error({msg:`can't find this route ${req.originalUrl}`})
next(new AppError(`can't find this route: ${req.originalUrl} on server`,404))
})

//global error handling middleware
app.use(Globalmiddleware)

dbConnection()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


process.on("unhandledRejection",(err)=>{
    console.log("unhandledRejection",err)
})