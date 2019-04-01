const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const keys = require('../config/keys');
const appConfig = require('../config/app.config');
const User = require('../models/user.model');
const validateRegisterInput = require('../validators/user/register');
const validateLoginInput = require('../validators/user/login');

exports.Register = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const newUser = new User();

      Object.assign(newUser, req.body);

      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          res.status(500).json(err);
        }
        bcrypt.hash(newUser.password, salt, (errHash, hash) => {
          if (errHash) {
            throw errHash;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(userResult => res.json(userResult))
            .catch(errSave => res.json(errSave));
        });
      });
    }
  });
};

exports.GoogleSignIn = async (req, res) => {
  try {
    // const oAuth2Client = await getAuthenticatedClient();
    const oAuth2Client = new OAuth2Client(
      keys.google.client_id,
      keys.google.client_secret,
      keys.google.redirect_uris[0]
    );
    const tokenInfo = await oAuth2Client.getTokenInfo(req.body.accessToken);

    console.log(tokenInfo);

    // Error invalid token
    if (tokenInfo.email !== req.body.email) {
      const errors = {};

      errors.token = 'Invalid Token';

      return res.status(400).json(errors);
    }

    const loggedUser = await User.findOne({ email: req.body.email }).then(
      user => {
        if (!user) {
          const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            avatar: req.body.avatar,
            authenticationtype: 'google'
          });

          const result = newUser
            .save()
            .then(userResult => userResult)
            .catch(errSave => errSave);

          return result;
        }

        return user;
      }
    );

    // Create JWT payload
    if (loggedUser._id) {
      const payload = {
        id: loggedUser.id,
        name: `${loggedUser.firstname} ${loggedUser.lastname}`,
        avatar: loggedUser.avatar
      };

      // Sign token
      jwt.sign(
        payload,
        keys.secretOrKey,
        { expiresIn: appConfig.tokenExpiration },
        (err, token) => {
          if (err) {
            res.status(500).json(err);
          }
          res.json({
            success: true,
            token: `Bearer ${token}`
          });
        }
      );
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.Login = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email } = req.body;
  const { password } = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'User not found';

      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      // User matched
      if (isMatch) {
        // Create JWT payload
        const payload = {
          id: user.id,
          name: `${user.firstname} ${user.lastname}`,
          avatar: user.avatar
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: appConfig.tokenExpiration },
          (err, token) => {
            if (err) {
              res.status(500).json(err);
            }
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';

        return res.status(400).json(errors);
      }
    });
  });
};

exports.Current = (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
};
