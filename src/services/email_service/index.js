import { createTransport } from "nodemailer";

const sendEmail = (from, to, subject, text) => {
	var transporter = createTransport({
		service: process.env.EMAIL_SERVICE,
		auth: {
			user:  process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	var mailOptions = {
		from: from,
		to: to,
		subject: subject,
		text: text,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};

export default sendEmail;