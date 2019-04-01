const Validator = require('validator');
const isEmpty = require('../common/is-empty');

module.exports = function validateEventInput(data) {
  const errors = {};

  // List of fields to be validate
  const fields = ['title', 'start', 'end'];

  // Set undefined field values to string empty
  fields.map(field => {
    data[field] = !isEmpty(data[field]) ? data[field] : '';
  });

  if (!Validator.isLength(data.title, { min: 5, max: 200 })) {
    errors.title = 'Title must be between 5 and 200 characters';
  }

  if (Validator.isEmpty(data.start)) {
    errors.start = 'Start date field is required';
  }

  if (Validator.isEmpty(data.end)) {
    errors.end = 'End date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
