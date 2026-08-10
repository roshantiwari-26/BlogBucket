const transporter = require("../config/mailTransporter");

function sendOTP(email, otp) {
  const message = {
    from: `"BlogBucket" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "BlogBucket Registration OTP",
    html: `<p>Please enter the below OTP in your registeration page to proceed</p>
    <h3 style="letter-spacing: 8px; font-size: 24px;">${otp.split("").join(" ")}</h3>`,
  };
  return transporter.sendMail(message);
}
module.exports = sendOTP;
