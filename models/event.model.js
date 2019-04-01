const mongoose = require('mongoose');
const BaseProps = require('./base.props');
const Collections = require('./collections');

const { Schema } = mongoose;

// Create Schema
const EventProps = {
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  poster: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive']
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: Collections.locations
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: Collections.users
      }
    }
  ]
};

Object.assign(EventProps, BaseProps);

const EventSchema = new Schema(EventProps);

const Event = mongoose.model(Collections.events, EventSchema);

module.exports = Event;
