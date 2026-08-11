// const transporter = require("../config/mailTransporter");

// function sendOTP(email, otp) {
//   const message = {
//     from: `"BlogBucket" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "BlogBucket Registration OTP",
//     html: `<p>Please enter the below OTP in your registeration page to proceed</p>
//     <h3 style="letter-spacing: 8px; font-size: 24px;">${otp.split("").join(" ")}</h3>`,
//   };
//   return transporter.sendMail(message);
// }
// module.exports = sendOTP;

async function sendOTP(email, otp) {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "BlogBucket",
          email: process.env.EMAIL_USER,
        },
        to: [
          {
            email: email,
          },
        ],
        subject: "BlogBucket Registration OTP",
        htmlContent: `
          <p>Please enter the below OTP in your registration page to proceed:</p>
          <h3 style="letter-spacing: 8px; font-size: 24px;">${otp.split("").join(" ")}</h3>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Brevo API Error: ${data.message || JSON.stringify(data)}`,
      );
    }

    return data;
  } catch (error) {
    console.error("Error sending OTP via Brevo API:", error);
    throw error;
  }
}

module.exports = sendOTP;
