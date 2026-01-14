const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const flightrouter = require('./routes/flightroutes')
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "https://flight-booking-system-alpha.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

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
