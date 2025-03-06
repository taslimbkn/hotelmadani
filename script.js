document.addEventListener('DOMContentLoaded', () => {
    // Get all book now buttons
    const bookButtons = document.querySelectorAll('a.btn');
    
    // Create modal HTML
    const modalHTML = `
        <div id="bookingModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Book Your Stay</h2>
                <form id="bookingForm">
                    <div class="form-group">
                        <label for="checkIn">Check-in Date:</label>
                        <input type="date" id="checkIn" required min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label for="checkOut">Check-out Date:</label>
                        <input type="date" id="checkOut" required>
                    </div>
                    <div class="form-group">
                        <label for="guests">Number of Guests:</label>
                        <select id="guests" required>
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="roomType">Room Type:</label>
                        <select id="roomType" required>
                            <option value="deluxe">Deluxe Room</option>
                            <option value="executive">Executive Suite</option>
                        </select>
                    </div>
                    <div class="cancellation-policy">
                        <h3>Cancellation Policy</h3>
                        <ul>
                            <li>For cancellation done prior 9 AM on 5 March, 100% Refundable</li>
                            <li>For cancellation done post 9 AM on 5 March, Non Refundable</li>
                        </ul>
                    </div>
                    <button type="submit" class="btn">Confirm Booking</button>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Get modal elements
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    const bookingForm = document.getElementById('bookingForm');
    
    // Add click event to all book now buttons
    bookButtons.forEach(button => {
        if (button.textContent.toLowerCase().includes('book now')) {
            // In your click event handler for book buttons
            button.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('show');
                
                // If booking from room card, pre-select room type
                const roomCard = button.closest('.room-card');
                if (roomCard) {
                    const roomTitle = roomCard.querySelector('h3').textContent;
                    const roomSelect = document.getElementById('roomType');
                    if (roomTitle.includes('Deluxe')) {
                        roomSelect.value = 'deluxe';
                    } else if (roomTitle.includes('Executive')) {
                        roomSelect.value = 'executive';
                    }
                }
            });
        }
    });
    
    // Close modal when clicking (x) or outside
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // Handle form submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const guests = document.getElementById('guests').value;
        const roomType = document.getElementById('roomType').value;
        
        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (checkOutDate <= checkInDate) {
            alert('Check-out date must be after check-in date');
            return;
        }

        // Prepare booking message for WhatsApp
        const message = `New Booking at Hotel Madani:%0A%0A` +
            `Room Type: ${roomType}%0A` +
            `Check-in: ${checkIn}%0A` +
            `Check-out: ${checkOut}%0A` +
            `Number of Guests: ${guests}`;

        // Create WhatsApp link with pre-filled message
        const whatsappLink = `https://wa.me/919414230098?text=${message}`;

        // Show success message and open WhatsApp
        alert('Booking successful! Redirecting to WhatsApp for confirmation.');
        window.open(whatsappLink, '_blank');
        
        modal.classList.remove('show');
        bookingForm.reset();
    });
    
    // Set min date for check-out based on check-in
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    checkInInput.addEventListener('change', () => {
        const checkInDate = new Date(checkInInput.value);
        const nextDay = new Date(checkInDate);
        nextDay.setDate(checkInDate.getDate() + 1);
        checkOutInput.min = nextDay.toISOString().split('T')[0];
        
        if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
            checkOutInput.value = nextDay.toISOString().split('T')[0];
        }
    });

// Add this new code at the end of the DOMContentLoaded event listener
    const placesData = {
        'places': [
            { name: 'Junagarh Fort', distance: '3.1 kms' },
            { name: 'Karni Mata Temple', distance: '4.5 kms' },
            { name: 'Laxmi Niwas Palace', distance: '2.8 kms' },
            { name: 'Ganga Singh Museum', distance: '3.2 kms' }
        ],
        'transportation': [
            { name: 'Roadways Bus Station Parking', distance: '2.8 kms' },
            { name: 'Lalgarh Junction', distance: '2.9 kms' },
            { name: 'Private Bus Stand', distance: '4.3 kms' },
            { name: 'Bikaner East Railway Station', distance: '7.8 kms' },
            { name: 'Nal', distance: '8.2 kms' },
            { name: 'Nal Halt', distance: '9.3 kms' }
        ]
    };

    const tabs = document.querySelectorAll('.tab-btn');
    const placesList = document.querySelector('.places-list');

    function updatePlacesList(type) {
        placesList.innerHTML = '';
        placesData[type].forEach(place => {
            placesList.innerHTML += `
                <div class="place-item">
                    <div class="place-info">
                        <h4>${place.name}</h4>
                        <span class="distance">${place.distance}</span>
                        <button class="map-btn" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Bikaner')}', '_blank')">Show on Map</button>
                    </div>
                </div>
            `;
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const type = tab.textContent.toLowerCase().includes('transportation') 
                ? 'transportation' 
                : 'places';
            updatePlacesList(type);
        });
    });

    // Initialize with transportation list
    updatePlacesList('transportation');
});
// Add this to your existing script.js
document.querySelectorAll('.map-btn').forEach(button => {
    button.addEventListener('click', function() {
        const placeName = this.previousElementSibling.querySelector('h4').textContent;
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ' Bikaner')}`;
        window.open(mapUrl, '_blank');
    });
});