const transporter = require("../config/mailTransporter.js");

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "BlogBucket Email Verification OTP",

    html: `
      <h2>Welcome to BlogBucket</h2>

      <p>Your One-Time Password (OTP) is:</p>

      <h1 style="letter-spacing:5px;">${otp}</h1>

      <p>This OTP will expire in <strong>5 minutes</strong>.</p>

      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};

module.exports = sendOTPEmail;
