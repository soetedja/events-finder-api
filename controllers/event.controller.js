const Event = require('../models/event.model');

const validateEventInput = require('../validators/event/event.validate');

exports.Create = (req, res) => {
  const { errors, isValid } = validateEventInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Event.findOne({ title: req.body.title }).then(event => {
    if (event) {
      return res.status(400).json({ title: 'Title already exists' });
    } else {
      const newEvent = new Event();

      Object.assign(newEvent, req.body);

      newEvent
        .save()
        .then(eventResult => res.json(eventResult))
        .catch(errSave => res.json(errSave));
    }
  });
};
