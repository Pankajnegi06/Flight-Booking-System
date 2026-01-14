
const express = require("express")
const { getFlight, getFlightById, booking, getBookingHistory } = require("../controllers/flightController")

const flightrouter = express.Router()

flightrouter.get("/flightSearch",getFlight)
flightrouter.get("/flightbyId",getFlightById)
flightrouter.get("/booking",booking)
flightrouter.get("/bookingHistory",getBookingHistory)

module.exports = flightrouter