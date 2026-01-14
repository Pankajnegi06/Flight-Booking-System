const { default: mongoose } = require("mongoose")
const Flight = require("../models/flight")
const bookingattempt = require("../models/bookingattempt")
const User = require("../models/User")
const bookingflight = require("../models/Booking")
const generateAndUploadTicketPDF = require("../utils/ticketpdf")

const getFlight = async (req,res)=>{
    try {
        const flights = await Flight.find({}).limit(10)
        res.json(flights)
    } catch (error) {
        res.json({"status":500,"message":"flights not found"})
    }
}

const getFlightById = async (req, res) => {
  try {
    console.log(req.query)
    const { userId, flightId } = req.query;

    /* 1️⃣ Fetch flight using business ID */
    const flight = await Flight.findOne({ flightId: flightId });

    if (!flight) {
      return res.status(404).json({
        message: "Flight not found"
      });
    }

    /* 2️⃣ Reset surge if expired */
    if (
      flight.surge_active_until &&
      new Date() > flight.surge_active_until
    ) {
      flight.current_price = flight.base_price;
      flight.surge_active_until = null;
      await flight.save();
    }

    /* 3️⃣ Log booking attempt */
    await bookingattempt.create({
      userId: userId,
      flightId: flightId,
      attemptTime: new Date()
    });

    /* 4️⃣ Count attempts in last 5 minutes */
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const attemptCount = await bookingattempt.countDocuments({
      userId: userId,
      flightId: flightId,
      attemptTime: { $gte: fiveMinutesAgo }
    });

    /* 5️⃣ Apply surge pricing */
    if (attemptCount > 3 && !flight.surge_active_until) {
      flight.current_price = Math.round(flight.base_price * 1.10);
      flight.surge_active_until = new Date(Date.now() + 10 * 60 * 1000);
      await flight.save();
    }

    /* 6️⃣ Send response */
    res.status(200).json({
      message: "Flight fetched successfully",
      flight
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

const booking = async (req,res)=>{
    try {
        const {userId,flightId} = req.query

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }

        const flight = await Flight.findOne({flightId:flightId})
        if(!flight){
            return res.status(404).json({
                message:"Flight not found"
            })
        }

        const existingBooking = await bookingflight.findOne({ userId, flightId });
        if (existingBooking) {
            return res.status(400).json({
                message: "You have already booked this flight"
            });
        }

        if(user.wallet < flight.current_price){
            return res.status(400).json({
                message:"Insufficient balance"
            })
        }

        user.wallet -= flight.current_price
        await user.save()

        const pnr = `PNR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    /* 6️⃣ Generate PDF & upload to Cloudinary */
    const ticketUrl = await generateAndUploadTicketPDF({
      passenger_name: user.name,
      flight_id: flight.flightId,
      airline: flight.airline,
      route: `${flight.departure_city} → ${flight.arrival_city}`,
      price_paid: flight.current_price,
      booking_time: new Date(),
      pnr
    });

    /* 7️⃣ Create booking record (IMMUTABLE) */
    const booking = await bookingflight.create({
      userId,
      flightId,
      airline: flight.airline,
      route: `${flight.departure_city} → ${flight.arrival_city}`,
      price_paid: flight.current_price,
      bookingTime: new Date(),
      pnr,
      ticket_url: ticketUrl
    });

        res.status(200).json({
            message:"Booking successful",
            booking
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

const getBookingHistory = async(req,res)=>{
  try {
    const {userId} = req.query

    const bookingHistory = await bookingflight.find({userId:userId})
    if(!bookingHistory){
      res.status(500).send("Booking history not found")
    }
    res.status(200).send(bookingHistory)
  } catch (error) {
    console.error(error)
    res.status(500).send("Cannot fetch booking history")
  }
}

module.exports = {
    getFlight,
    getFlightById,
    booking,
    getBookingHistory
}