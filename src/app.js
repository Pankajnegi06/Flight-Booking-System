const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const flightrouter = require('./routes/flightroutes')
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Mount routes
app.use('/api', routes);
app.use('/flights',flightrouter)
app.get('/', (req, res) => {
    res.send('Welcome to XtechOn');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
