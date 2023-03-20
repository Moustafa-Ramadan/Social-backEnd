const multer  = require('multer')

module.exports.uploadimg=(path)=>{

    const storage = multer.diskStorage({})
      function fileFilter (req, file, cb) {
    
        console.log(file);
        if( file.mimetype.startsWith('image')){
            cb(null, true)
          }
          else
          {
            cb(null, false)
          }
      
      
      }
      
      const upload = multer({ storage,fileFilter })
      return upload.single(path)
      
}


// destination: function (req, file, cb) {
//   cb(null, 'uploads/')
// },
// filename: function (req, file, cb) {

//   cb(null,Date.now()+'-'+Math.random()*10+"-"+ file.originalname)
// }