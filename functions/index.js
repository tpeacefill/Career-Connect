/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// eslint-disable-next-line no-unused-vars
const {onRequest} = require("firebase-functions/v2/https");
// eslint-disable-next-line no-unused-vars
const logger = require("firebase-functions/logger");


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Using environment configuration for email and password
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendCounselingEmail = functions.https.onCall(async (data, context) => {
  const {to, subject, body} = data;
  const mailOptions = {
    from: "peacefilltawiah@gmail.com>",
    to,
    subject,
    text: body,
  };

  try {
    await mailTransport.sendMail(mailOptions);
    console.log("Email sent.");
    return {success: true};
  } catch (error) {
    console.error("There was an error while sending the email:", error);
    return {success: false};
  }
});
