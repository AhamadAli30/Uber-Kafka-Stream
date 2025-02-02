document.addEventListener("DOMContentLoaded", () => {
    const rideList = document.getElementById("rideList");

    async function fetchRides() {
        try {
            const response = await fetch("http://localhost:3001/get-rides");
            const rides = await response.json();
            
            rideList.innerHTML = "";
            rides.forEach((ride, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = `Ride ${index + 1}: ${ride.source} to ${ride.destination}, ${ride.passengers} passengers, $${ride.price}`;
                
                const acceptButton = document.createElement("button");
                acceptButton.textContent = "Accept";
                acceptButton.onclick = async () => {
                    await fetch("http://localhost:3000/accept-ride", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ rideId: ride.id })
                    });

                    alert("Ride accepted!");
                    fetchRides();
                };

                listItem.appendChild(acceptButton);
                rideList.appendChild(listItem);
            });
        } catch (error) {
            console.error("Error fetching rides:", error);
        }
    }

    fetchRides();
    setInterval(fetchRides, 5000); // Poll for new rides every 5 seconds
});
