const mongoose = require('mongoose');
const Collections = require('./collections');

const { Schema } = mongoose;

const BaseProps = {
  created_by: {
    user: {
      type: Schema.Types.ObjectId,
      ref: Collections.users
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  modified_by: {
    user: {
      type: Schema.Types.ObjectId,
      ref: Collections.users
    }
  },
  modified_at: {
    type: Date,
    default: Date.now
  }
};

module.exports = BaseProps;
