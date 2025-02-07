document.getElementById("rideForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;
    const passengers = document.getElementById("passengers").value;

    // Simulate API call to calculate time and distance
    const { distance, time } = await calculateRideDetails(source, destination);

    // Calculate price based on distance and time
    const price = calculatePrice(time);

    document.getElementById("time").value = time + " mins";
    document.getElementById("price").value = "$" + price;

    const rideDetails = {
        source,
        destination,
        passengers,
        price,
        time
    };

    try {
        const response = await fetch("http://localhost:3000/book-ride", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rideDetails)
        });

        const result = await response.json();
        document.getElementById("status").textContent = result.message;
    } catch (error) {
        document.getElementById("status").textContent = "Error booking ride.";
        console.error(error);
    }
});

function calculateRideDetails(source, destination) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const estimatedTime = Math.floor(Math.random() * (120 - 30 + 1)) + 30;
            resolve({ distance: 15, time: estimatedTime });
        }, 1000);
    });
}

function calculatePrice(time) {
    const minPrice = 100;
    const maxPrice = 350;
    
    // Generate a random factor between 0 and 1
    const randomFactor = Math.random();

    // Scale the price proportionally within the range
    return (minPrice + randomFactor * (maxPrice - minPrice)).toFixed(2);
}

// Fetch accepted rides every 500ms
async function fetchAcceptedRides() {
    try {
        const response = await fetch("http://localhost:3000/accept-ride");
        const rides = await response.json();

        const acceptedRidesContainer = document.getElementById("acceptedRides");
        acceptedRidesContainer.innerHTML = "<h2>Accepted Rides</h2>";

        if (rides.length === 0) {
            acceptedRidesContainer.innerHTML += "<p>No accepted rides yet.</p>";
            return;
        }

        rides.forEach(ride => {
            const rideElement = document.createElement("div");
            rideElement.className = "ride";
            rideElement.innerHTML = `
                <p><strong>Driver Name:</strong> ${ride.driverName}</p>
                <p><strong>Contact No:</strong> ${ride.phone}</p>
                
                <hr>
            `;
            acceptedRidesContainer.appendChild(rideElement);
        });
    } catch (error) {
        console.error("Error fetching accepted rides:", error);
    }
}

// Call fetchAcceptedRides every 500ms
setInterval(fetchAcceptedRides, 500);