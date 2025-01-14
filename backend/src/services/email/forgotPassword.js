const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const sendResetLink = async (email) =>{
    const token = jwt.sign({email : email}, process.env.JWT_SECRET, { expiresIn: '1h' });
    const transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,  
      auth: {
        user: process.env.EMAIL_ID, 
        pass: process.env.APP_PASSWORD,
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: 'Reset Password Link',
      text: `Click on the link to reset your password: ${process.env.REACT_APP_CLIENT_URL}/reset-password/${token} \n\nIf you didn't register, you can ignore this email.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return false;
      }
      console.log("Email sent");
    });
    return true;
}

module.exports = sendResetLink;