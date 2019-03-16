const Validator = require('validator');
const isEmpty = require('../common/is-empty');

module.exports = function validateLocationInput(data) {
  const errors = {};

  // List of fields to be validate
  const fields = ['name'];

  // Set undefined field values to string empty
  fields.map(field => {
    data[field] = !isEmpty(data[field]) ? data[field] : '';
  });

  if (!Validator.isLength(data.name, { min: 5, max: 200 })) {
    errors.title = 'Location name be between 5 and 200 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
