const nodemailer = require("nodemailer");




module.exports.sendemail=async(option)=>{


    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: process.env.EMAIL , // generated ethereal user
          pass:process.env.EMAIL_KEY
        },
      });

       await transporter.sendMail({
        from: '"Fred Foo 👻" <testcodec38@gmail.com>', // sender address
        to:option.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<div style="background:#000;color:#FFF;padding:20px">
            <b>${option.message}</b>
            <a  href="http://localhost:3001/users/confirm/${option.token}">verified</a>
        </div>`, // html body
      },
      (err,info)=>{
if(err){
    console.log(err)
}else{
    console.log(info)
}

      }
      
      
      );
}