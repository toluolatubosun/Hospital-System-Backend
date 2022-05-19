require('dotenv').config()
require('express-async-errors');
const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(process.env.PORT))
    .then((result) => console.log('Server is listening for requests'))
    .catch((error) => console.log(error))

// Middleware
app.use(
    cors({
        origin: '*'
    })
);
app.use(express.json())

// Route Middleware
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/user', require('./routes/user.route'));
app.use('/api/patient', require('./routes/patient.route'));

// Error Handling Middleware
require("./middlewares/error.middleware")(app);