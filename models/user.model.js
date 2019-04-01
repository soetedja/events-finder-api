const mongoose = require('mongoose');
const BaseProps = require('./base.props');
const Collections = require('./collections');

const { Schema } = mongoose;

const UserProps = {
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String
  },
  password: {
    type: String
    // required: true
  },
  gender: {
    type: String
  },
  authenticationtype: {
    type: String
  },
  // status: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'status'
  // },
  avatar: {
    type: String
  }
};

Object.assign(UserProps, BaseProps);

const UserSchema = new Schema(UserProps);

const User = mongoose.model(Collections.users, UserSchema);

module.exports = User;
