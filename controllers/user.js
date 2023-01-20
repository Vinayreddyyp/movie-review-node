const User = require('../models/user')
const EmailVertificationToken = require('../models/emailVerification')
const nodemailer = require('nodemailer')
const {isValidObjectId} = require('mongoose')


//create user controller
exports.create = async(req,res) => {
     console.log('req', req.body);
     const {name,email,password} = req.body;

     const oldUser = await User.findOne({email})

     if(oldUser) {
          return res.status(401).send({error:'user is already resgistered'})
     }

     //creting new user model
     const newUser = new User({name,  email,  password});
     await newUser.save()

     let OTP = '';

     for(let i=0; i<=5; i++) {
         const randomValue = Math.round(Math.random()* 9);
         OTP += randomValue;
     }

     //store otp inside our db

     const newEmailVerificationToken = new EmailVertificationToken({
          owner: newUser._id,
          token: OTP,

     })

     //this save the email token to the db
     await newEmailVerificationToken.save()

     //send that otp to the user
     const transport = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "2c53a76b581eff",
            pass: "36fe8e58d7f133"
          }
        });

     transport.sendMail({
          from: 'verification@reviewapp.com',
          to: newUser.email,
          subject: 'Email Verification',
          html: `
          <p>Your Verification OTP</p>
          <h1>${OTP}</h1>
          `
     })


     res.json({message: "please verify your email for one time password"})

}

exports.sigin = async(req,res) => {
    const {email, password} = req.body;
    console.log('email and passoword', email, password)
}

//verifying email 
exports.verifyEmail = async (req,res) => {
     const { userId, OTP} = req.body;

     if(!isValidObjectId(userId)) return res.json({error: "Invalid user!"})

     const user = await User.findById(userId);
    if(!user) return res.json({error: "user not found"});

    if(user.isVerified) return res.json({error: "user is alredy verified"});

    const token = await EmailVertificationToken.findOne({owner: userId});
    if(!token) return res.json({error: "token not found"});

    const isMatched = await token.compareToken(OTP);
    if(!isMatched) return res.json({error: 'Please submit a vlaid OTP!'});
    user.isVerified = true;
    await user.save();

    await EmailVertificationToken.findByIdAndDelete(token._id);
   
    const transport = nodemailer.createTransport({
     host: "smtp.mailtrap.io",
     port: 2525,
     auth: {
       user: "2c53a76b581eff",
       pass: "36fe8e58d7f133"
     }
   });

transport.sendMail({
     from: 'verification@reviewapp.com',
     to: user.email,
     subject: 'Welcome Email',
     html: `
     <p>Welcome to our app and thanks for choosing us</p>
     <h1>${OTP}</h1>
     `
})

res.json({message: 'Your email is verified'})
}

exports.resendEmailVerficationToken = async(req,res) => {
      const {userId} = req.body;
      const user = await User.findById(userId);
      if(!user) return res.json({error: "user not found"});
      if(user.isVerified) return res.json({error: "this email id is already verified"});
      const alreadyHasToken = await EmailVertificationToken.findOne({owner: userId, });
      if(alreadyHasToken)  return res.json({error: 'Only after one hour you can request for another token'});
      let OTP = '';

     for(let i=0; i<=5; i++) {
         const randomValue = Math.round(Math.random()* 9);
         OTP += randomValue;
     }

     //store otp inside our db

     const newEmailVerificationToken = new EmailVertificationToken({
          owner: newUser._id,
          token: OTP,

     })

     //this save the email token to the db
     await newEmailVerificationToken.save()

     //send that otp to the user
     const transport = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "2c53a76b581eff",
            pass: "36fe8e58d7f133"
          }
        });

     transport.sendMail({
          from: 'verification@reviewapp.com',
          to: newUser.email,
          subject: 'Email Verification',
          html: `
          <p>Your Verification OTP</p>
          <h1>${OTP}</h1>
          `
     })
   res.json({message: 'New OTP has been generated'})


}