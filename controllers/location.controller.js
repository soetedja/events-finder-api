const Locations = require('../models/location.model');

const validateLocationInput = require('../validators/location/location.validate');

exports.Create = (req, res) => {
  const { errors, isValid } = validateLocationInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Locations.findOne({ title: req.body.title }).then(location => {
    if (location) {
      return res.status(400).json({ title: 'Title already exists' });
    } else {
      const newLocation = new Locations();

      Object.assign(newLocation, req.body);

      newLocation
        .save()
        .then(locationResult => res.json(locationResult))
        .catch(errSave => res.json(errSave));
    }
  });
};
