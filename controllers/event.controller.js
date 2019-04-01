const Events = require('../models/event.model');
const Users = require('../models/user.model');
const Locations = require('../models/location.model');
const validateEventInput = require('../validators/event/event.validate');

const _getById = async id => {
  try {
    const event = await Events.findOne({ _id: id }).populate({
      path: 'location'
    });

    return event;
  } catch (err) {
    return null;
  }
};

exports.GetAll = async (req, res) => {
  try {
    const events = await Events.find({ end: { $gte: Date.now() } }).populate({
      path: 'location'
    });

    res.json(events);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.FetchExplore = (req, res) => {
  try {
    const pageNo = parseInt(req.query.pageNo);
    const pageSize = parseInt(req.query.pageSize);
    // checking if page number is invalid

    if (pageNo <= 0) {
      const response = {
        success: false,
        message: 'Invalid Page Number'
      };

      return res.status(200).json(response);
    } else {
      // fetch data from database based on given page no and page size
      let index = parseInt(pageNo - 1) * parseInt(pageSize);
      const data = [];

      for (let i = 0; i < pageSize - 1; i++) {
        data.push({
          index,
          text: `Data ${index}`
        });
        index++;
      }
      const response = {
        success: true,
        data
      };

      return res.status(200).json(response);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.Fetch = (req, res) => {
  try {
    const pageNo = parseInt(req.query.pageNo);
    const pageSize = parseInt(req.query.pageSize);
    // checking if page number is invalid

    if (pageNo <= 0) {
      const response = {
        success: false,
        message: 'Invalid Page Number'
      };

      return res.status(200).json(response);
    } else {
      // fetch data from database based on given page no and page size
      let index = parseInt(pageNo - 1) * parseInt(pageSize);
      const data = [];

      for (let i = 0; i < pageSize - 1; i++) {
        data.push({
          index,
          text: `Data ${index}`
        });
        index++;
      }
      const response = {
        success: true,
        data
      };

      return res.status(200).json(response);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.FetchEventsInThisArea = (req, res) => {
  try {
    const { northLat, southLat, eastLng, westLng } = req.body;

    Events.aggregate(
      [
        {
          $lookup: {
            from: 'locations',
            localField: 'location',
            foreignField: '_id',
            as: 'location'
          }
        },
        { $unwind: '$location' },
        {
          $match: {
            'location.lat': { $lte: northLat, $gte: southLat },
            'location.lng': { $lte: eastLng, $gte: westLng }
          }
        },
        {
          // $addFields: {
          //   title: { $toString: '$title' }
          // },
          $addFields: {
            'location.lat': { $toString: '$location.lat' },
            'location.lng': { $toString: '$location.lng' }
          }
        }
      ],
      (err, events) => {
        if (err) {
          res.status(500).send(err);
        }
        events.map(event => {
          if (
            event.likes &&
            event.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            event.liked = true;
          }
        });

        res.json(events);
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.Like = (req, res) => {
  Users.findOne({ user: req.user.id }).then(user => {
    Events.findById(req.params.id)
      .then(event => {
        if (
          event.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: 'User already liked this event' });
        }

        // Add user id to likes array
        event.likes.unshift({ user: req.user.id });

        event.save().then(eventRes => {
          event.customProps = {
            liked: true
          };
          res.json({ ...event.customProps, ...event.toJSON() });
        });
      })
      .catch(err => res.status(404).json({ eventnotfound: 'No event found' }));
  });
};

exports.Unlike = (req, res) => {
  Users.findOne({ user: req.user.id }).then(user => {
    Events.findById(req.params.id)
      .then(event => {
        if (
          event.likes &&
          event.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: 'You have not yet liked this event' });
        }

        // Get remove index
        const removeIndex = event.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        // Splice out of array
        event.likes.splice(removeIndex, 1);

        // Save
        event.save().then(event => {
          event.customProps = {
            liked: false
          };
          res.json({ ...event.customProps, ...event.toJSON() });
        });
      })
      .catch(err => res.status(404).json({ eventnotfound: 'No event found' }));
  });
};

exports.Create = async (req, res) => {
  try {
    const { errors, isValid } = validateEventInput(req.body);

    const newEvent = new Events();

    Object.assign(newEvent, req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Check existing location
    const loc = await Locations.findOne({
      lat: req.body.lat,
      lng: req.body.lng
    });

    if (loc) {
      newEvent.location = loc.id;
    } else {
      const location = new Locations({
        name: req.body.location,
        formatted_address: req.body.formatted_address,
        lat: req.body.lat,
        lng: req.body.lng,
        icon: req.body.icon,
        place_id: req.body.place_id,
        url: req.body.url
      });
      const newLoc = await location.save();

      newEvent.location = newLoc.id;
    }

    Events.findOne({ title: req.body.title }).then(event => {
      if (event) {
        return res.status(400).json({ title: 'Title already exists' });
      } else {
        newEvent.save(async (err, ev) => {
          if (err) {
            res.status(500).send(err);
          }
          const newEvt = await _getById(ev._id);

          res.json(newEvt);
        });
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
