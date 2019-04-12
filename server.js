const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
// const swaggerUi = require('swagger-ui-express');
// const path = require('path');
const swaggerDoc = require('./swagger/swaggerDoc');
const users = require('./routes/user.route');
const events = require('./routes/event.route');

const app = express();

swaggerDoc(app);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Use Routes
app.use('/users', users);
app.use('/events', events);

// Server static assets if in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.user(express.static('client/build'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
