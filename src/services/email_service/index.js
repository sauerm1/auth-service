import { createTransport } from "nodemailer";
import generateEmail from "./generateEmail";
const fs = require("fs");

const sendEmail = ({ from, to, subject, template, variables }) => {
    try {

        var transporter = createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    
        const html = fs.readFileSync(`${__dirname}/email_templates/${template}.html`, "utf8");
    
        var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: generateEmail(html, variables),
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
        return true
    } catch (err) {
        console.log(err)
        return err
    }
};

export default sendEmail;
