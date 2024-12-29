"use strict";
const express = require("express");
const router = express.Router();
const path = require("node:path");
const bcrypt = require("bcrypt");
const model_connection = require("../../model/connection/model.connection");
const validator = require("validator");
const { v4: uuid } = require("uuid");
const { format } = require("date-fns");
const { SendMail, SendVerificationMail } = require("../middleware/mail/nodemailer.middleware.controller");

router.route("/").post(async (request, response) => {
    response.statusCode = Number(parseInt(201));
    response.setHeader("Content-Type", "Application/json");
    let { username, email, password } = request.body;

    const DuplicateAdminEmail = await model_connection.query(`
        SELECT admin_email AS email FROM admins WHERE admin_email = ?
    `, [email]);

    console.log(DuplicateAdminEmail);

    try {
        if (DuplicateAdminEmail[0]?.length) {
            response.status(Number(parseInt(400)))
                .jsonp({
                    message: "Email already in use!"
                });
        } else if (!username || !email || !password) {
            response.status(Number(parseInt(400)))
                .jsonp({
                    message: "All fields are required!"
                });
        } else if (!validator.isEmail(email)) {
            response.status(Number(parseInt(400)))
                .jsonp({
                    message: "Invalid email address!"
                });
        } else if (!validator.isStrongPassword(password)) {
            response.status(Number(parseInt(400)))
                .jsonp({
                    message: "Include Upper and Lowercase characters, numbers and symbols to continue in password plz!",
                    instructions: "Include Upper and Lowercase characters, numbers and symbols to continue!"
                });
        } else {
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(`${JSON.stringify(password)}`, salt);
            var date = format(new Date(), "MM/dd/yyyy\tHH:mm:ss");
            const admin_id = uuid();

            await model_connection.query(`
                INSERT INTO admins (admin_id, admin_email, admin_password, date, admin_username) VALUES (?, ?, ?, ?, ?)
            `, [admin_id, email, hash, date, username]);

            // on successful registration send email to confirm and congratulate
            // user for getting an account
            // Send a welcome email
            await SendVerificationMail(
                email, 'Verify your email account!',
            );
            response.status(Number(parseInt(201)))
                .jsonp({
                    message: "admin has been registered, wait a moment plz..."
                });
        }
    } catch (error) {
        console.log(error);
        response.status(Number(parseInt(500)))
            .jsonp({
                message: error.message
            });
    }
});


module.exports = router;