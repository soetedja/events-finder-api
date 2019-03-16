const keysDev = require('./keys.dev');
const keysProd = require('./keys.prod');

if (process.env.NODE_ENV === 'production') {
  module.exports = keysProd;
} else {
  module.exports = keysDev;
}
