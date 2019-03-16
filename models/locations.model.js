const mongoose = require('mongoose');
const BaseProps = require('./base.props');
const Collections = require('./collections');

const { Schema } = mongoose;

const LocationProps = {
  name: {
    type: String,
    required: true
  },
  addressline1: {
    type: String,
    required: true
  },
  addressline2: {
    type: String
  },
  latitude: {
    type: String
  },
  longitude: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  district: {
    type: String
  },
  gmapsurl: {
    type: String
  },
  postalcode: {
    type: String
  },
  province: {
    type: String
  },
  regency: {
    type: String
  },
  village: {
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
