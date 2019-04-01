const mongoose = require('mongoose');
const BaseProps = require('./base.props');
const Collections = require('./collections');

const { Schema } = mongoose;

const LocationProps = {
  name: {
    type: String,
    required: true
  },
  formatted_address: {
    type: String,
    required: true
  },
  lat: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  lng: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  icon: {
    type: String
  },
  place_id: {
    type: String
  },
  url: {
    type: String
  }
  // status: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'status'
  // }
};

Object.assign(LocationProps, BaseProps);

const LocationSchema = new Schema(LocationProps);

const Location = mongoose.model(Collections.locations, LocationSchema);

module.exports = Location;
