import nodemailer from "nodemailer" ;
import dotenv from "dotenv";

dotenv.config({path: "../.././.env"}) ;  

const transport = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
    }}
) ;

// const mailOptions = {
//     from: process.env.MAIL_USER,
//     to: 'oliver.inzunza244748@potros.itson.edu.mx',
//     subject: 'PASSWORD RECOVER',
//     text: 'Error'
// }

// transport.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log('Email sent: ' + info.response);
//   });

export default transport ;
  