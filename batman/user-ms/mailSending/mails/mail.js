import nodemailer from "nodemailer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import ejs from "ejs";
import { userModel } from "../../database/models/index.js";
import { MAIL_APP_PASSWORD, MAIL_ID } from "../../config/index.js";

console.log("email id from the env is", MAIL_ID);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: MAIL_ID,
    pass: MAIL_APP_PASSWORD,
  },
});

function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: "karymitra@gmail.com",
    to,
    subject,
    text,
    html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        console.error("Mail options:", mailOptions);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(info.response);
      }
    });
  });
}

async function senduserWelcomeEmail(userEmail) {
  const subject = "Welcome to karyMitra";
  const text = "WELCOME!";

  try {
    const user = await userModel.findOne({
      email: userEmail,
    });
    console.log("user Data:", user);
    if (!user) {
      throw new Error("user not found");
    }

    const html = ejs.render(
      fs.readFileSync(
        path.join(__dirname, "mailTemplates", "userWelcome.ejs"),
        "utf8"
      )
      // {
      //   data: { firstname: user.fullName },
      // }
    );

    const response = await sendEmail(userEmail, subject, text, html);
    console.log("Welcome Email sent:", response);
  } catch (error) {
    console.error(error);
    throw new Error("Welcome Email could not be sent");
  }
}
async function senduserVerificationMail(userEmail, link) {
  const subject = "Verification Link";
  const text = "Please verify your self!";

  try {
    const user = await userModel.findOne({
      email: userEmail,
    });
    console.log("user Data:", user);
    if (!user) {
      throw new Error("user not found");
    }

    const html = ejs.render(
      fs.readFileSync(
        path.join(
          __dirname,
          "mailTemplates",
          "userVerificationLinkTemplate.ejs"
        ),
        "utf8"
      ),
      {
        data: { Link: link, Name: user.firstName },
      }
    );

    const response = await sendEmail(userEmail, subject, text, html);
    console.log("Verification Email sent:", response);
  } catch (error) {
    console.error(error);
    throw new Error("Verification Email could not be sent");
  }
}
export { senduserWelcomeEmail, senduserVerificationMail };
