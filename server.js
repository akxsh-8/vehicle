const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// MONGODB CONNECTION
// ===============================

const MONGO_URL = "mongodb://127.0.0.1:27017/vehicleRentalDB";

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("=================================");
        console.log("MongoDB Connected Successfully");
        console.log("Database: vehicleRentalDB");
        console.log("=================================");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:");
        console.log(error);
    });


// ===============================
// VEHICLE SCHEMA
// ===============================

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    seats: {
        type: Number,
        required: true
    },

    transmission: {
        type: String,
        required: true
    },

    fuel: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    available: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);


// ===============================
// BOOKING SCHEMA
// ===============================

const bookingSchema = new mongoose.Schema({

    customerName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    vehicleId: {
        type: String,
        required: true
    },

    vehicleName: {
        type: String,
        required: true
    },

    pickupDate: {
        type: String,
        required: true
    },

    returnDate: {
        type: String,
        required: true
    },

    pickupLocation: {
        type: String,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "Confirmed"
    }

}, {
    timestamps: true
});

const Booking = mongoose.model("Booking", bookingSchema);


// ===============================
// HOME PAGE
// ===============================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});


// ===============================
// GET ALL VEHICLES
// ===============================

app.get("/api/vehicles", async (req, res) => {

    try {

        const vehicles = await Vehicle
            .find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            vehicles: vehicles
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Unable to get vehicles"
        });
    }
});


// ===============================
// ADD VEHICLE
// ===============================

app.post("/api/vehicles", async (req, res) => {

    console.log("--------------------------------");
    console.log("ADD VEHICLE REQUEST");
    console.log(req.body);
    console.log("--------------------------------");

    try {

        const {
            name,
            type,
            seats,
            transmission,
            fuel,
            price
        } = req.body;


        // Validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Vehicle name is required"
            });
        }

        if (!type) {
            return res.status(400).json({
                success: false,
                message: "Vehicle type is required"
            });
        }

        if (!seats) {
            return res.status(400).json({
                success: false,
                message: "Number of seats is required"
            });
        }

        if (!transmission) {
            return res.status(400).json({
                success: false,
                message: "Transmission is required"
            });
        }

        if (!fuel) {
            return res.status(400).json({
                success: false,
                message: "Fuel type is required"
            });
        }

        if (!price) {
            return res.status(400).json({
                success: false,
                message: "Price is required"
            });
        }


        // Create vehicle
        const vehicle = new Vehicle({

            name: name.trim(),

            type: type.trim(),

            seats: Number(seats),

            transmission: transmission,

            fuel: fuel,

            price: Number(price),

            available: true
        });


        // SAVE TO MONGODB
        const savedVehicle = await vehicle.save();


        console.log("VEHICLE SAVED TO MONGODB");
        console.log(savedVehicle);


        res.status(201).json({

            success: true,

            message: "Vehicle saved successfully",

            vehicle: savedVehicle
        });


    } catch (error) {

        console.log("MONGODB SAVE ERROR:");
        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message
        });
    }
});


// ===============================
// DELETE VEHICLE
// ===============================

app.delete("/api/vehicles/:id", async (req, res) => {

    try {

        await Vehicle.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Vehicle deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Delete failed"
        });
    }
});


// ===============================
// GET BOOKINGS
// ===============================

app.get("/api/bookings", async (req, res) => {

    try {

        const bookings = await Booking
            .find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            bookings: bookings
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Unable to get bookings"
        });
    }
});


// ===============================
// ADD BOOKING
// ===============================

app.post("/api/bookings", async (req, res) => {

    console.log("--------------------------------");
    console.log("ADD BOOKING REQUEST");
    console.log(req.body);
    console.log("--------------------------------");

    try {

        const {
            customerName,
            email,
            phone,
            vehicleId,
            vehicleName,
            pickupDate,
            returnDate,
            pickupLocation,
            totalAmount
        } = req.body;


        if (!customerName ||
            !email ||
            !phone ||
            !vehicleId ||
            !vehicleName ||
            !pickupDate ||
            !returnDate ||
            !pickupLocation) {

            return res.status(400).json({

                success: false,

                message: "Please fill all booking fields"
            });
        }


        const booking = new Booking({

            customerName,

            email,

            phone,

            vehicleId,

            vehicleName,

            pickupDate,

            returnDate,

            pickupLocation,

            totalAmount: Number(totalAmount),

            status: "Confirmed"
        });


        const savedBooking =
            await booking.save();


        console.log("BOOKING SAVED TO MONGODB");

        console.log(savedBooking);


        res.status(201).json({

            success: true,

            message: "Booking saved successfully",

            booking: savedBooking
        });


    } catch (error) {

        console.log("BOOKING SAVE ERROR:");

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message
        });
    }
});


// ===============================
// DELETE BOOKING
// ===============================

app.delete("/api/bookings/:id", async (req, res) => {

    try {

        await Booking.findByIdAndDelete(
            req.params.id
        );

        res.json({

            success: true,

            message: "Booking deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Delete failed"
        });
    }
});


// ===============================
// STATISTICS
// ===============================

app.get("/api/stats", async (req, res) => {

    try {

        const vehicleCount =
            await Vehicle.countDocuments();

        const bookingCount =
            await Booking.countDocuments();

        const confirmedCount =
            await Booking.countDocuments({
                status: "Confirmed"
            });

        res.json({

            vehicleCount,

            bookingCount,

            confirmedCount
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Stats error"
        });
    }
});