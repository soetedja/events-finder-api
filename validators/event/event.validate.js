const Validator = require('validator');
const isEmpty = require('../common/is-empty');

module.exports = function validateEventInput(data) {
  const errors = {};

  // List of fields to be validate
  const fields = ['title'];

  // Set undefined field values to string empty
  fields.map(field => {
    data[field] = !isEmpty(data[field]) ? data[field] : '';
  });

  if (!Validator.isLength(data.title, { min: 5, max: 200 })) {
    errors.title = 'Title must be between 5 and 200 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
