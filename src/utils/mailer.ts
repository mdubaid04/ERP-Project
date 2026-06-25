import nodemailer from "nodemailer";

const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your Login OTP",
    text: `Your OTP is ${otp} and is valid for 5 minutes`,
  });
};

export { sendOtpEmail };
