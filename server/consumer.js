const express = require("express");
const { Kafka } = require("kafkajs");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Kafka Configuration
const kafka = new Kafka({
    clientId: "ride-booking",
    brokers: ["localhost:9091"] // or "localhost:9091" for local testing
});


const consumer = kafka.consumer({ groupId: "ride-consumers" });

let availableRides = [];

// Function to run Kafka consumer
const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "ride-requests", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const ride = JSON.parse(message.value.toString());
            ride.id = Date.now(); // Unique ID for each ride
            availableRides.push(ride);
            console.log("New ride request received:", ride);
        }
    });
};

runConsumer();

// API Endpoint to get available rides
app.get("/get-rides", (req, res) => {
    res.json(availableRides);
});

// API Endpoint for drivers to accept a ride
app.post("/accept-ride", (req, res) => {
    const { rideId } = req.body;
    availableRides = availableRides.filter(ride => ride.id !== rideId);
    res.json({ message: "Ride accepted successfully!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Consumer Server running at http://localhost:${PORT}`);
});
