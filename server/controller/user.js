/* eslint-disable no-shadow */
/* eslint-disable max-len */
const cloudinary = require('cloudinary');
const DataUri = require('datauri');
const Account = require('../models/account');
const AccountHelper = require('../helpers');
require('../helpers/config');


module.exports = {
    register: (req, res, next) => {
        const member = new Account({
            user_email: req.body.email,
            password: req.body.password,
            display_name: req.body.name,
            registration: Date.now(),
        });

        member.save((err, data) => {
            if (err) {
                res.status(500).json({ message: 'Internal Server Error', type: 'error' });
            }

            if (data) {
                next();
            }
        });
    },

    login: (req, res) => {
        Account.findOne({ user_email: req.body.email })
        .select('+password')
        .exec((err, user) => {
            if (err) throw err;

            if (user) {
                const payload = {
                    displayName: user.display_name,
                    id: user._id,
                    email: user.user_email,
                    photoURL: user.photo_url,
                    coverURL: user.cover_url,
                    verified: user.verified,
                };
                user.comparePassword(req.body.password, (err, match) => {
                    if (err) throw err;

                    if (match) {
                        res.json({
                            message: 'Login successfully',
                            type: 'success',
                            code: 200,
                            token: AccountHelper.setToken(payload),
                        });
                    } else {
                        res.json({
                            message: 'Invalid email or password',
                            type: 'error',
                            code: 403,
                        });
                    }
                });
            }
        });
    },

    getUser: (req, res) => {
        Account.findOne({ _id: req.params.id },
            (err, user) => {
                if (err) throw err;

                if (user) {
                    res.send(user);
                }
            });
        },

    updateSetting: (req, res) => {
        const { email, name } = req.body.originalKeyValue;
        if (email) {
            Account.findByIdAndUpdate({ _id: req.params.id }, { $set: { user_email: req.body.entry } })
            .exec((err, user) => {
                if (err) {
                    throw err;
                }

                if (user) {
                    // Set token payload with new email
                    const payload = {
                        displayName: user.display_name,
                        id: user._id,
                        email: req.body.entry,
                        photoURL: user.photo_url,
                        coverURL: user.cover_url,
                    };
                     res.json({
                        message: 'Account Updated!',
                        token: AccountHelper.setToken(payload),
                        code: 200,
                    });
                }
            });
        } else if (name) {
            Account.findByIdAndUpdate({ _id: req.params.id }, { $set: { display_name: req.body.entry } })
            .exec((err, user) => {
                if (err) {
                    res.json({
                        message: 'Username already exists',
                     });
                     return;
                }


                if (user) {
                    // Set token payload with new display_name
                    const payload = {
                        displayName: req.body.entry,
                        id: user._id,
                        email: user.user_email,
                        photoURL: user.photo_url,
                        coverURL: user.cover_url,
                    };
                    res.json({
                        message: 'Account Updated!',
                        token: AccountHelper.setToken(payload),
                        code: 200,
                    });
                } else {
                    res.json({
                        message: 'Unknown error has occured.',
                        code: 500,
                    });
                }
            });
        }
    },

    updateProfile: (req, res) => {
        const uri = new DataUri();
        const asyncUpload = [];
        for (const key in req.files) {
          const buffer = req.files[key][0].buffer;
          uri.format('.png', buffer);
          const uriContent = uri.content;
          const ref = key;
          asyncUpload.push(new Promise((resolve, reject) => {
                  cloudinary.v2.uploader.upload(uriContent, (error, result) => {
                      if (error) {
                          reject(error);
                      }
                      if (result.url) {
                          resolve({
                              field: `${ref}_url`,
                              data: {
                                  url: result.url,
                              },
                          });
                      }
                  });
              }));
         }

          Promise.all(asyncUpload)
          .then((results) => {
                // Save data
                const constructObj = results.reduce((acc, cur) => Object.assign(acc, { [cur.field]: cur.data.url }), {});
                Account.findByIdAndUpdate({ _id: req.params.id }, { $set: constructObj })
                .exec((err, user) => {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                      const profile = results.filter(i => i.field === 'photo_url');
                      const cover = results.filter(i => i.field === 'cover_url');
                      const payload = {
                          displayName: user.display_name,
                          id: user._id,
                          email: user.user_email,
                          photoURL: profile.length <= 0 ? req.body.oldPhoto : profile[0].data.url,
                          coverURL: cover.length <= 0 ? req.body.oldCover : cover[0].data.url,
                      };

                      res.json({
                          message: 'Account Updated!',
                          token: AccountHelper.setToken(payload),
                          code: 200,
                      });
                    }
                });
            })
            .catch((err) => {
                res.json({
                    message: err,
                    code: 501,
                });
            });
  },
};
