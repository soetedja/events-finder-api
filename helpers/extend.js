exports.Object = function(destination, source) {
  Object.keys(source).map(prop => {
    destination[prop] = source[prop];
  });
};
