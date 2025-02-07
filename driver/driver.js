// Updated driver.js with driver profile and Kafka integration

document.addEventListener("DOMContentLoaded", () => {
    const rideList = document.getElementById("rideList");
    const driverProfile = { name: "John", phone: "9988776655" };

    async function fetchRides() {
        try {
            const response = await fetch("http://localhost:3001/get-rides");
            const rides = await response.json();
            
            rideList.innerHTML = "";
            rides.forEach((ride, index) => {
                const listItem = document.createElement("li");
                listItem.classList.add("ride-item");
                
                const rideDetails = `
                    <div class="ride-details">
                        <p><strong>Ride ${index + 1}:</strong> ${ride.source} to ${ride.destination}</p>
                        <p><strong>Passengers:</strong> ${ride.passengers}</p>
                        <p><strong>Price:</strong> $${ride.price}</p>
                    </div>
                `;

                listItem.innerHTML = rideDetails;

                const acceptButton = document.createElement("button");
                acceptButton.textContent = "Accept Ride";
                acceptButton.classList.add("accept-button");
                acceptButton.onclick = async () => {
                    await fetch("http://localhost:3000/accept-ride", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            rideId: ride.id, 
                            driverName: driverProfile.name, 
                            phone: driverProfile.phone 
                        })
                    });

                    rideList.removeChild(listItem);
                };

                listItem.appendChild(acceptButton);
                rideList.appendChild(listItem);
            });
        } catch (error) {
            console.error("Error fetching rides:", error);
        }
    }

    fetchRides();
    setInterval(fetchRides, 5000);
});
