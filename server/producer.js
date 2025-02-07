// Updated producer.js to send driver details upon ride acceptance without disturbing ride request

const express = require("express");
const { Kafka } = require("kafkajs");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Kafka Configuration
const kafka = new Kafka({
    clientId: "ride-booking",
    brokers: ["localhost:9092"]
});

const producer = kafka.producer();

const runProducer = async () => {
    await producer.connect();
    console.log("Kafka Producer connected");
};

runProducer();

// API Endpoint to book a ride (unchanged)
app.post("/book-ride", async (req, res) => {
    const rideDetails = req.body;

    try {
        await producer.send({
            topic: "ride-requests",
            messages: [{ value: JSON.stringify(rideDetails) }]
        });

        res.json({ message: "Ride request sent successfully!" });
    } catch (error) {
        console.error("Error sending message to Kafka:", error);
        res.status(500).json({ message: "Failed to send ride request" });
    }
});

const accepted_ride = [];

// API Endpoint for ride acceptance
app.post("/accept-ride", async (req, res) => {
    const { rideId, driverName, phone } = req.body;

    try {
        accepted_ride.push({rideId,driverName,phone});
        res.json({ message: "Ride accepted and customer notified!" });
    } catch (error) {
        console.error("Error notifying customer:", error);
        res.status(500).json({ message: "Failed to notify customer" });
    }
});

app.get("/accept-ride", async (req,res)=> {
    return res.json(accepted_ride);
})


app.listen(PORT, () => {
    console.log(`Producer Server running at http://localhost:${PORT}`);
});
