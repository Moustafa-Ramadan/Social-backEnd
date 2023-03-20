
const mongoose=require('mongoose')

let schema=mongoose.Schema({
    name:String ,
    email:String,
    password:String ,
    age:Number ,
    phone:String,
    emailconfiem:{
        type:Boolean,
        default:false
    },
    acode:{
        type:String,
    },
    image: {
        type: String,
        default:"https://res.cloudinary.com/dtm4kmm5s/image/upload/v1674813467/profile.social-media-user_nm27ki.jpg"
    } ,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref:'user' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref:'user' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref:'user' }],
    requests:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
        }
    ],
    isOnline:{
        type:Boolean,
        default:false
    },

})

// schema.post('init', function(doc) {
//     doc.image='http://localhost:3001/'+doc.image
//   });
  



module.exports=mongoose.model('user',schema)













