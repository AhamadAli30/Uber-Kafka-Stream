document.getElementById("rideForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const rideDetails = {
        source: document.getElementById("source").value,
        destination: document.getElementById("destination").value,
        passengers: document.getElementById("passengers").value,
        price: document.getElementById("price").value
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
