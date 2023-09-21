const nodemailer = require('nodemailer');
require('dotenv').config();

// const { META_PASSWORD } = process.env;
const { META_USER, USER_EMAIL, USER_PASSWORD } = process.env;

async function sendEmail({ to, subject, html }) {

    // const transporter = nodemailer.createTransport({
    //     host: "smtp.meta.ua",
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         user: META_USER,
    //         pass: META_PASSWORD,
    //     },
    // });

    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: USER_EMAIL,
            pass: USER_PASSWORD,
        },
    });

    const email = await transporter.sendMail({
        from: META_USER,
        to,
        subject,
        html,
    });

    console.log("Message sent: %s", email.messageId);
}

module.exports = sendEmail







