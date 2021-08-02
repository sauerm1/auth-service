import { createTransport } from "nodemailer";
import createHTMLTemplate from "./createTemplate";
const path = require("path");
const fs = require("fs");

const sendEmail = ({ from, to, subject, template, variables }) => {
	var transporter = createTransport({
		service: process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const html = fs.readFileSync(`${__dirname}/email_templates/${fileName}.html`, "utf8");

	var mailOptions = {
		from: from,
		to: to,
		subject: subject,
		html: createHTMLTemplate(html, variables),
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
			return false;
		} else {
			console.log("Email sent: " + info.response);
			return "Email sent: " + info.response;
		}
	});
};

export default sendEmail;
