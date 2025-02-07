// Updated consumer.js to forward driver details to customer without disturbing ride request

const express = require("express");
const { Kafka } = require("kafkajs");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
const PORT = 3001;

app.use(express.json());
app.use(cors());

const kafka = new Kafka({
    clientId: "ride-booking",
    brokers: ["localhost:9091"]
});

const consumer = kafka.consumer({ groupId: "ride-consumers" });
let availableRides = [];

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "ride-requests", fromBeginning: true });
    await consumer.subscribe({ topic: "ride-accepted", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const data = JSON.parse(message.value.toString());

            if (topic === "ride-requests") {
                data.id = Date.now();
                availableRides.push(data);
                console.log("New ride request received:", data);
            }

            if (topic === "ride-accepted") {
                console.log("Ride accepted:", data);
                io.emit("rideAccepted", {
                    message: "Ride Accepted",
                    driverName: data.driverName,
                    phone: data.phone
                });
            }
        }
    });
};

runConsumer();

app.get("/get-rides", (req, res) => {
    res.json(availableRides);
});

server.listen(PORT, () => {
    console.log(`Consumer Server running at http://localhost:${PORT}`);
});
