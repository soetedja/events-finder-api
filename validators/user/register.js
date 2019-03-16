const Validator = require('validator');
const isEmpty = require('../common/is-empty');

module.exports = function validateRegisterInput(data) {
  const errors = {};

  // List of fields to be validate
  const fields = [
    'name',
    'username',
    'email',
    'firstname',
    'password',
    'password2'
  ];

  // Set undefined field values to string empty
  fields.map(field => {
    data[field] = !isEmpty(data[field]) ? data[field] : '';
  });

  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = 'Username must be between 5 and 30 characters';
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = 'Username field is required';
  }

  if (!Validator.isLength(data.firstname, { min: 2, max: 30 })) {
    errors.firstname = 'First name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.firstname)) {
    errors.firstname = 'First name field is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 and 30 characters';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Password must matched';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
