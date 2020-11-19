const nodemailer = require('nodemailer');

function sendmail (options) {
	let transporter = nodemailer.createTransport({
	    service: "SendGrid",
	    auth: {
	      user: process.env.SENDGRID_USER, // generated ethereal user
	      pass: process.env.SENDGRID_PASSWORD, // generated ethereal password
	    }
	 });
	transporter.sendMail(options).then( () => {
		console.log('Email sent')
	}).catch( err => {
		console.log(err);
	})
}

module.exports = sendmail;