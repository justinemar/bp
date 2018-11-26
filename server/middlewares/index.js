const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;

const multer = require('multer');
const AccountHelper = require('../helpers');
const Account = require('../models/account');

const storage = multer.memoryStorage();
const upload = multer({ storage }).fields([{ name: 'logo', maxCount: 1 }, { name: 'photo', maxCount: 1 }, { name: 'cover', maxCount: 1 }]);
const uploadArray = multer({ storage }).array('image', 12);
require('dotenv').config();


module.exports = {


    sendVerification: (req, res) => {
        const email = req.params.email ? req.params.email : req.body.email;
        const verificationToken = AccountHelper.setToken({ email });
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL,
                clientId: process.env.OauthClientID,
                clientSecret: process.env.OauthClientSecret,
                refreshToken: process.env.refreshToken,
                accessToken: process.env.accessToken,
            },
        });

        res.render('verification', {
            email,
            link: `${process.env.HOST}verify/${verificationToken}`,
          }, (err, html) => {
            const mailOptions = {
              to: email,
              from: 'bida@asia.com',
              subject: 'BIDA Account Verification',
              html,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(`Could not send mail ${error}`);
                }

                if (info) {
                    res.json({
                        message: 'An email containing your verification link has been sent.',
                        type: 'success',
                        code: 200,
                    });
                }
              });
        });
    },

    verifyEmail: (req, res) => {
        jwt.verify(req.params.token, process.env.KEY1, (err, decoded) => {
            if (err) {
                res.status(403).json({
                    message: 'Invalid or expired verification link',
                    type: 'error',
                    code: 403,
                });
            }

            if (decoded) {
                Account.findOneAndUpdate({ user_email: decoded.email }, { $set: { verified: true } }, { new: true })
                .exec((err, user) => {
                    if (err) {
                        res.status(500).json({ message: 'Internal Server Error', type: 'error' });
                    }

                    if (user) {
                        const payload = {
                            displayName: user.display_name,
                            id: user._id,
                            email: user.user_email,
                            photoURL: user.photo_url,
                            coverURL: user.cover_url,
                            verified: user.verified,
                        };
                        res.status(200).json({
                            message: 'Email is now verified',
                            type: 'success',
                            code: 200,
                            token: AccountHelper.setToken(payload),
                        });
                    }
                });
            }
        });
    },

    checkUser: (req, res, next) => {
        Account.findOne({ $or: [{ user_email: req.body.email }, { display_name: req.body.name }] })
        .exec((err, user) => {
            if (err) {
                res.status(500).json({ message: 'Internal Server Error', type: 'error' });
            }

            if (user) {
                res.json({
                    message: `${user.user_email === req.body.email ? 'Email' : 'Display Name'
                      } is already taken`,
                    type: 'error',
                });
            } else {
                next();
            }
        });
    },

    checkUserStatus: (req, res, next) => {
        Account.findOne({ user_email: req.body.email })
        .exec((err, user) => {
            if (err) {
                res.status(500).json({ message: 'Internal Server Error', type: 'error' });
            }

            if (user && !user.verified) {
                res.status(403).json({
                    user,
                    message: 'A verified email is required for this feature.',
                    type: 'error',
                });
            } else if (user) {
                next();
            } else {
                res.status(403).json({
                    message: "We can't find an account associated with this email",
                    type: 'error',
                    code: 403,
                });
            }
        });
    },

    upload: (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
              console.log(err);
            }
            next();
          });
    },


    uploadArray: (req, res, next) => {
        uploadArray(req, res, (err) => {
            if (err) {
                console.log(err);
            }
            next();
        });
    },
};
