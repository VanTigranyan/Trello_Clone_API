const config = require("config.json");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailer = require('nodemailer');
const hbs = require('express-handlebars').create({});
const db = require("_helpers/db");
const User = db.User;
const Reset= db.Reset;

module.exports = {
    sendMail,
    setNewPassword
}


let transport = mailer.createTransport({
    service: 'gmail',
    auth: {
           user: config.mailerAcc,
           pass: config.mailerPass
        }
});



async function sendMail(email) {
    const user = await User.findOne({email: email});
    const reset = new Reset({email: email});
    const token = jwt.sign({email: email}, "passwordReset", {expiresIn: '1h'});
    async function render(path , options) {
        const res = await hbs.render(path,options);
        return res;
    }

    const html = render('./reset/reset.hbs',{title: 'Reset password', token: token})
        .then(html => {
            const options = {
                from: 'Trello Clone',
                to: email,
                subject: 'Password reset for User ' + user.name,
                html: html
            }
        
             transport.sendMail(options, (err, info) => {
                if(err) {
                    console.log('mailerror----',err)
                } else {
                    console.log('Message sent: ' + info.response);
                    console.log(info);
                    return true;
                }
            })
        });
        
       
    reset.confirmToken = token;
    reset.save();

    
}

// async function reset(token) {
//     const reset = await Reset.findOne({token: token});
//     if(!reset || !token) {throw new Error('Provide valid token!')}
//     else {
//       const confirmToken = crypto.randomBytes(64).toString('hex');
//       reset.confirmToken = confirmToken;
//       reset.save();
//       return confirmToken;
//     }
// }

async function setNewPassword(options) {
    const reset = await Reset.findOne({confirmToken: options.confirmToken});
    if(!reset) { throw new Error('Invalid Reset Token!')}
    else {
        const user = await User.findOne({email: reset.email});
        const newPassword = bcrypt.hashSync(options.password, 10);
        user.password = newPassword;
        user.save();

        return await Reset.deleteOne(reset);
    }
}