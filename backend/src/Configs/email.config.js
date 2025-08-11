import { EMAIL_ACCOUNT } from "../constant.js";

const otpMailConfig = ({ otp, userEmail }) => {
      const mailOption = {
            from: EMAIL_ACCOUNT,
            to: userEmail,
            subject: "Reset Your Password",
            html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: rgb(255,255,255);">
            <div style="text-align: center;">
                  <h2 style="color: rgb(50,180,81);">Reset Your Password</h2>
            </div>
            <p style="font-size: 16px; color: rgb(0,0,0);">
                  Hello,
            </p>
            <p style="font-size: 16px; color: rgb(0,0,0);">
                  You requested to reset your password. Please use the following One-Time Password (OTP) to reset your password. This OTP is valid for <strong>15 minutes</strong>.
            </p>
            <div style="text-align: center; margin: 20px 0;">
                  <span style="display: inline-block; padding: 12px 24px; font-size: 24px; font-weight: bold; color: rgb(255,255,255); background-color: rgb(50,180,81); border-radius: 5px;">
                        ${otp}
                  </span>
            </div>
            <p style="font-size: 16px; color: rgb(0,0,0);">
                  If you did not request a password reset, please ignore this email.
            </p>
            <p style="font-size: 16px; color: rgb(0,0,0);">
                  Thank you,
                  <br />
                  <strong>The Team</strong>
            </p>
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: rgb(123,193,68);">
                  <p>
                        © 2024 EEINA. All rights reserved.
                  </p>
            </div>
      </div>
      `,
      };

      return mailOption;
};



const emailVerificationConfig = ({ userName, userEmail, email_verification_code }) => {
      const mailOption = {
            from: EMAIL_ACCOUNT,
            to: userEmail,
            subject: "Verify Your Email Address",
            html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: rgb(255,255,255);">
            <div style="text-align: center;">
                  <h2 style="color: rgb(50,180,81);">Verify Your Email Address</h2>
            </div>
            <p style="font-size: 16px; color: rgb(0,0,0);">
                  Hello <strong>${userName}</strong>,
            </p>
            <p style="font-size: 16px; color: rgb(0,0,0);">
                  Thank you for registering! To complete your sign-up and activate your account, please use the following verification code. This code is valid for <strong>15 minutes</strong>.
            </p>
            <div style="text-align: center; margin: 20px 0;">
                  <span style="display: inline-block; padding: 12px 24px; font-size: 24px; font-weight: bold; color: rgb(255,255,255); background-color: rgb(50,180,81); border-radius: 5px;">
                        ${email_verification_code}
                  </span>
            </div>
            <p style="font-size: 16px; color: rgb(0,0,0);">
                  If you did not sign up for an account, you can safely ignore this email.
            </p>
            <p style="font-size: 16px; color: rgb(0,0,0);">
                  Best regards,
                  <br />
                  <strong>The Team</strong>
            </p>
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: rgb(123,193,68);">
                  <p>
                        © 2024 EEINA. All rights reserved.
                  </p>
            </div>
      </div>
      `,
      };

      return mailOption;
};



export { otpMailConfig, emailVerificationConfig };
