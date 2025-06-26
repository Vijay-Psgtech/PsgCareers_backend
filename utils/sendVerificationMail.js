const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
  const link = `http://localhost:5173/verify/${token}`;
  
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

   await transporter.sendMail({
    from: `PSG Careers <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - PSG Careers',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <img src="http://localhost:5173/public/logo.png" alt="PSG Careers" style="height: 60px;" />
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <h2 style="color: #333;">Welcome to PSG Careers</h2>
                    <p style="font-size: 16px; color: #555;">Thank you for registering. Please verify your email address by clicking the button below:</p>
                    <a href="${link}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px;">
                      Verify Email
                    </a>
                    <p style="font-size: 14px; color: #888; margin-top: 30px;">If you did not create an account, no further action is required.</p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 30px;">
                    <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} PSG Careers. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `
  });
};

module.exports = sendVerificationEmail;
