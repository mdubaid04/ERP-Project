import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
interface MailOptions {
  To: string;
  Subject: string;
  Text: string;
  Html: string;
}
const sendEmail = async ({ To, Subject, Text, Html }: MailOptions) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: To,
    subject: Subject,
    text: Text,
    html: Html,
  });
};

const sendOtpEmail = async (email: string, otp: string) => {
  await sendEmail({
    To: email,
    Subject: "OTP for login",
    Text: `Your OTP for login is ${otp} and is valid for 5 minutes`,
    Html: `<div style="font-family:Arial, Helvetica, sans-serif;max-width:480px;margin:auto;padding:24px; border : 1px solid #e0e0e0; border-radius:8px;">
      <h2 style="color:#333;">Login Verification</h2>
      <p style="color:#555; font-size:14px;">Use the OTP below to complete your login. This code is valid for 5 minutes.</p>
      <div style="background-color:#f5f5f5; padding:16px; border-radius:6px; text-align:center;margin:20px 0;">
      <span style="font-size:28px; font-weight:bold; letter-spacing:6px; color:#2563eb;">
      ${otp}
      </span>
      </div>
      <p style="color:#888; font-size:12px;">If you did't request this, you can ignore this email.</p>
      </div>`,
  });
};

const sendResetPasswordOtpEmail = async (email: string, otp: string) => {
  await sendEmail({
    To: email,
    Subject: "OTP for Reset Password",
    Text: `Your OTP for reset password is ${otp} and is valid for 5 minutes`,
    Html: `<div style="font-family:Arial, Helvetica, sans-serif;max-width:480px;margin:auto;padding:24px; border : 1px solid #e0e0e0; border-radius:8px;">
      <h2 style="color:#333;">Reset Password</h2>
      <p style="color:#555; font-size:14px;">Use the OTP below to reset your password. This code is valid for 5 minutes.</p>
      <div style="background-color:#f5f5f5; padding:16px; border-radius:6px; text-align:center;margin:20px 0;">
      <span style="font-size:28px; font-weight:bold; letter-spacing:6px; color:#2563eb;">
      ${otp}
      </span>
      </div>
      <p style="color:#888; font-size:12px;">If you did't request this, you can ignore this email.</p>
      </div>`,
  });
};

const sendPasswordEmail = async (email: string, tempPassword: string) => {
  await sendEmail({
    To: email,
    Subject: "Temporary Password for login",
    Text: `Your Temporary Password for login is ${tempPassword}`,
    Html: `<div style="font-family:Arial, Helvetica, sans-serif;max-width:480px;margin:auto;padding:24px; border : 1px solid #e0e0e0; border-radius:8px;">
      <h2 style="color:#333;">Temporary Password</h2>
      <p style="color:#555; font-size:14px;">Welcome to the portal.Your account has been created successfully and You can use this temporary password to login</p>
      <div style="background-color:#f5f5f5; padding:16px; border-radius:6px; text-align:center;margin:20px 0;">
      <span style="font-size:28px; font-weight:bold; letter-spacing:6px; color:#2563eb;">
      ${tempPassword}
      </span>
      </div>
      <p style="color:#888; font-size:12px;">If you did't request this, you can ignore this email.</p>
      </div>`,
  });
};

const sendLeaveResponseMail = async (
  email: string,
  action: string,
  rejectReason: string,
  remainingLeaves: number
) => {
  sendEmail({
    To: email,
    Subject: "Leave Request",
    Text: `Your leave request has been ${action}.${action === "REJECTED" ? ` Reason:${rejectReason}.` : ""} You have ${remainingLeaves} leaves remaining.`,
    Html: `<div style="font-family:Arial, Helvetica, sans-serif;max-width:480px;margin:auto;padding:24px; border : 1px solid #e0e0e0; border-radius:8px;">
      <h2 style="color:#333;">Leave Request Response</h2>
      <p style="color:#555; font-size:14px;">Your leave request has been <strong>${action}</strong>.${action === "REJECTED" ? `<br/> Reason:${rejectReason}.` : ""}</p>
      <div style="background-color:#f5f5f5; padding:16px; border-radius:6px; text-align:center;margin:20px 0;">
      <p style="color:#888; font-size:12px;">Remaining Leaves: <strong>${remainingLeaves}</strong>.</p>
      </div>
      <p style="color:#888; font-size:12px;">If you did't request this, you can ignore this email.</p>
      </div>`,
  });
};

export {
  sendEmail,
  sendOtpEmail,
  sendResetPasswordOtpEmail,
  sendPasswordEmail,
  sendLeaveResponseMail,
};
