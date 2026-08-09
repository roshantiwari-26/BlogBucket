const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOTP(email, otp) {
  const { data, error } = await resend.emails.send({
    from: "BlogBucket <onboarding@resend.dev>",
    to: [email],
    subject: "BlogBucket Email Verification",
    html: `
      <h2>BlogBucket Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  });

  if (error) {
    console.log("Email sending error:", error);
    throw new Error("Failed to send OTP email");
  }

  console.log("OTP email sent:", data.id);
}

module.exports = sendOTP;
