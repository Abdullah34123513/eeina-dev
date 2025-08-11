import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_SERVICE, EMAIL_USER } from "../constant.js";

export const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE, // service name
      auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
      },
});
