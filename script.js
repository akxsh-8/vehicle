document.addEventListener("DOMContentLoaded", function () {

    loadVehicles();
    loadBookings();
    loadStats();
    setMinimumDates();

    // =========================================
    // ADD VEHICLE
    // =========================================

    const vehicleForm =
        document.getElementById("vehicleForm");

    if (vehicleForm) {

        vehicleForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                console.log("SUBMIT BUTTON CLICKED");

                const vehicleData = {

                    name:
                        document
                        .getElementById("vehicleName")
                        .value
                        .trim(),

                    type:
                        document
                        .getElementById("vehicleType")
                        .value
                        .trim(),

                    seats:
                        document
                        .getElementById("vehicleSeats")
                        .value,

                    transmission:
                        document
                        .getElementById("vehicleTransmission")
                        .value,

                    fuel:
                        document
                        .getElementById("vehicleFuel")
                        .value,

                    price:
                        document
                        .getElementById("vehiclePrice")
                        .value
                };


                console.log(
                    "DATA BEING SENT:",
                    vehicleData
                );


                if (
                    !vehicleData.name ||
                    !vehicleData.type ||
                    !vehicleData.seats ||
                    !vehicleData.transmission ||
                    !vehicleData.fuel ||
                    !vehicleData.price
                ) {

                    alert(
                        "Please fill all vehicle fields."
                    );

                    return;
                }


                try {

                    const response =
                        await fetch(
                            "/api/vehicles",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        vehicleData
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    console.log(
                        "SERVER RESPONSE:",
                        result
                    );


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Vehicle could not be saved"
                        );
                    }


                    alert(
                        "Vehicle saved successfully in MongoDB!"
                    );


                    vehicleForm.reset();


                    await loadVehicles();

                    await loadStats();


                } catch (error) {

                    console.error(
                        "SAVE ERROR:",
                        error
                    );

                    alert(
                        "Vehicle was not saved.\n\n" +
                        error.message
                    );
                }
            }
        );
    }


    // =========================================
    // BOOKING
    // =========================================

    const bookingForm =
        document.getElementById("bookingForm");


    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                console.log(
                    "BOOKING SUBMIT CLICKED"
                );


                const vehicleSelect =
                    document.getElementById(
                        "bookingVehicle"
                    );


                const selectedOption =
                    vehicleSelect.options[
                        vehicleSelect.selectedIndex
                    ];


                const bookingData = {

                    customerName:
                        document
                        .getElementById("customerName")
                        .value
                        .trim(),

                    email:
                        document
                        .getElementById("email")
                        .value
                        .trim(),

                    phone:
                        document
                        .getElementById("phone")
                        .value
                        .trim(),

                    vehicleId:
                        vehicleSelect.value,

                    vehicleName:
                        selectedOption
                        ? selectedOption.textContent
                        : "",

                    pickupDate:
                        document
                        .getElementById("pickupDate")
                        .value,

                    returnDate:
                        document
                        .getElementById("returnDate")
                        .value,

                    pickupLocation:
                        document
                        .getElementById("pickupLocation")
                        .value
                        .trim(),

                    totalAmount:
                        Number(
                            document
                            .getElementById("totalAmount")
                            .value
                        )
                };


                console.log(
                    "BOOKING DATA:",
                    bookingData
                );


                if (
                    !bookingData.customerName ||
                    !bookingData.email ||
                    !bookingData.phone ||
                    !bookingData.vehicleId ||
                    !bookingData.pickupDate ||
                    !bookingData.returnDate ||
                    !bookingData.pickupLocation
                ) {

                    alert(
                        "Please fill all booking fields."
                    );

                    return;
                }


                try {

                    const response =
                        await fetch(
                            "/api/bookings",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        bookingData
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    console.log(
                        "BOOKING SERVER RESPONSE:",
                        result
                    );


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Booking could not be saved"
                        );
                    }


                    alert(
                        "Booking saved successfully in MongoDB!"
                    );


                    bookingForm.reset();


                    if (
                        typeof closeBookingModal ===
                        "function"
                    ) {

                        closeBookingModal();
                    }


                    await loadBookings();

                    await loadStats();


                } catch (error) {

                    console.error(
                        "BOOKING ERROR:",
                        error
                    );

                    alert(
                        "Booking was not saved.\n\n" +
                        error.message
                    );
                }
            }
        );
    }
});


// =========================================
// LOAD VEHICLES
// =========================================

let vehicles = [];


async function loadVehicles() {

    try {

        const response =
            await fetch("/api/vehicles");


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message
            );
        }


        vehicles =
            data.vehicles || [];


        displayVehicles(
            vehicles
        );


        updateBookingVehicleList(
            vehicles
        );


    } catch (error) {

        console.error(
            "LOAD VEHICLES ERROR:",
            error
        );
    }
}


// =========================================
// DISPLAY VEHICLES
// =========================================

function displayVehicles(vehicleData) {

    const list =
        document.getElementById(
            "vehicleList"
        );


    if (!list) return;


    if (vehicleData.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <h3>No vehicles available</h3>
                <p>Add a vehicle from the admin section.</p>
            </div>
        `;

        return;
    }


    list.innerHTML =
        vehicleData.map(vehicle => {

            return `

                <div class="vehicle-card">

                    <div class="vehicle-content">

                        <h3>
                            ${escapeHTML(
                                vehicle.name
                            )}
                        </h3>

                        <p>
                            Type:
                            ${escapeHTML(
                                vehicle.type
                            )}
                        </p>

                        <p>
                            Seats:
                            ${vehicle.seats}
                        </p>

                        <p>
                            Transmission:
                            ${escapeHTML(
                                vehicle.transmission
                            )}
                        </p>

                        <p>
                            Fuel:
                            ${escapeHTML(
                                vehicle.fuel
                            )}
                        </p>

                        <h3>
                            ₹${Number(
                                vehicle.price
                            ).toFixed(2)}
                            / day
                        </h3>

                        <button
                            onclick="
                                openBookingModal(
                                    '${vehicle._id}'
                                )
                            "
                        >
                            Book Now
                        </button>

                        <button
                            onclick="
                                deleteVehicle(
                                    '${vehicle._id}'
                                )
                            "
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


// =========================================
// DELETE VEHICLE
// =========================================

async function deleteVehicle(id) {

    if (
        !confirm(
            "Are you sure you want to delete this vehicle?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/vehicles/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message
            );
        }


        alert(
            "Vehicle deleted successfully."
        );


        loadVehicles();

        loadStats();


    } catch (error) {

        alert(
            "Delete failed: " +
            error.message
        );
    }
}


// =========================================
// BOOKING VEHICLE DROPDOWN
// =========================================

function updateBookingVehicleList(
    vehicleData
) {

    const select =
        document.getElementById(
            "bookingVehicle"
        );


    if (!select) return;


    select.innerHTML =
        `<option value="">
            Select Vehicle
        </option>`;


    vehicleData.forEach(vehicle => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            vehicle._id;


        option.textContent =
            `${vehicle.name} - ₹${vehicle.price}/day`;


        select.appendChild(
            option
        );
    });
}


// =========================================
// BOOKING MODAL
// =========================================

function openBookingModal(
    vehicleId
) {

    const modal =
        document.getElementById(
            "bookingModal"
        );


    const select =
        document.getElementById(
            "bookingVehicle"
        );


    if (!modal || !select) {
        return;
    }


    select.value =
        vehicleId;


    modal.style.display =
        "flex";


    calculateTotal();
}


function closeBookingModal() {

    const modal =
        document.getElementById(
            "bookingModal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// =========================================
// CALCULATE TOTAL
// =========================================

function calculateTotal() {

    const vehicleId =
        document.getElementById(
            "bookingVehicle"
        )?.value;


    const pickup =
        document.getElementById(
            "pickupDate"
        )?.value;


    const returnDate =
        document.getElementById(
            "returnDate"
        )?.value;


    const totalField =
        document.getElementById(
            "totalAmount"
        );


    if (
        !vehicleId ||
        !pickup ||
        !returnDate
    ) {

        if (totalField) {
            totalField.value = "";
        }

        return;
    }


    const vehicle =
        vehicles.find(
            v => v._id === vehicleId
        );


    if (!vehicle) return;


    const start =
        new Date(pickup);


    const end =
        new Date(returnDate);


    const difference =
        end - start;


    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    if (days <= 0) {

        alert(
            "Return date must be after pickup date."
        );

        totalField.value = "";

        return;
    }


    const total =
        days *
        Number(vehicle.price);


    totalField.value =
        total.toFixed(2);
}


// =========================================
// DATE CHANGE
// =========================================

document.addEventListener(
    "change",
    function (event) {

        if (
            event.target.id ===
                "pickupDate" ||

            event.target.id ===
                "returnDate" ||

            event.target.id ===
                "bookingVehicle"
        ) {

            calculateTotal();
        }
    }
);


// =========================================
// LOAD BOOKINGS
// =========================================

async function loadBookings() {

    try {

        const response =
            await fetch(
                "/api/bookings"
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message
            );
        }


        displayBookings(
            data.bookings || []
        );


    } catch (error) {

        console.error(
            "BOOKINGS LOAD ERROR:",
            error
        );
    }
}


// =========================================
// DISPLAY BOOKINGS
// =========================================

function displayBookings(
    bookings
) {

    const list =
        document.getElementById(
            "bookingList"
        );


    if (!list) return;


    if (bookings.length === 0) {

        list.innerHTML =
            "<p>No bookings yet.</p>";

        return;
    }


    list.innerHTML =
        bookings.map(
            booking => `

            <div class="booking-card">

                <h3>
                    ${escapeHTML(
                        booking.vehicleName
                    )}
                </h3>

                <p>
                    Customer:
                    ${escapeHTML(
                        booking.customerName
                    )}
                </p>

                <p>
                    Email:
                    ${escapeHTML(
                        booking.email
                    )}
                </p>

                <p>
                    Phone:
                    ${escapeHTML(
                        booking.phone
                    )}
                </p>

                <p>
                    Pickup:
                    ${escapeHTML(
                        booking.pickupDate
                    )}
                </p>

                <p>
                    Return:
                    ${escapeHTML(
                        booking.returnDate
                    )}
                </p>

                <p>
                    Location:
                    ${escapeHTML(
                        booking.pickupLocation
                    )}
                </p>

                <p>
                    Total:
                    ₹${Number(
                        booking.totalAmount
                    ).toFixed(2)}
                </p>

                <strong>
                    ${escapeHTML(
                        booking.status
                    )}
                </strong>

            </div>
        `
        ).join("");
}


// =========================================
// STATISTICS
// =========================================

async function loadStats() {

    try {

        const response =
            await fetch(
                "/api/stats"
            );


        const data =
            await response.json();


        const vehicleCount =
            document.getElementById(
                "vehicleCount"
            );


        const bookingCount =
            document.getElementById(
                "bookingCount"
            );


        const confirmedCount =
            document.getElementById(
                "confirmedCount"
            );


        if (vehicleCount) {

            vehicleCount.textContent =
                data.vehicleCount;
        }


        if (bookingCount) {

            bookingCount.textContent =
                data.bookingCount;
        }


        if (confirmedCount) {

            confirmedCount.textContent =
                data.confirmedCount;
        }


    } catch (error) {

        console.error(
            "STATS ERROR:",
            error
        );
    }
}


// =========================================
// MINIMUM DATE
// =========================================

function setMinimumDates() {

    const today =
        new Date()
        .toISOString()
        .split("T")[0];


    const pickup =
        document.getElementById(
            "pickupDate"
        );


    const returnDate =
        document.getElementById(
            "returnDate"
        );


    if (pickup) {

        pickup.min =
            today;
    }


    if (returnDate) {

        returnDate.min =
            today;
    }
}


// =========================================
// SECURITY
// =========================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}