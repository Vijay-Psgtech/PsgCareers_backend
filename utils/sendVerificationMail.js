const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
  const link = `http://careertest.psginstitutions.in/verify/${token}`;
  
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `PSG Careers ${process.env.EMAIL_USER}`,
    to: email,
    subject: 'Email Verification',
    html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`
  });
};

module.exports = sendVerificationEmail;
