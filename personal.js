
// Vaccination Tracker
let vaccineRecords = JSON.parse(localStorage.getItem('vaccineRecords')) || [];

document.getElementById('vaccineForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newRecord = {
        name: document.getElementById('vaccineName').value,
        dose: document.getElementById('doseNumber').value,
        date: document.getElementById('vaccineDate').value
    };
    vaccineRecords.push(newRecord);
    localStorage.setItem('vaccineRecords', JSON.stringify(vaccineRecords));
    updateVaccineTable();
    this.reset();
});

function updateVaccineTable() {
    const tbody = document.getElementById('vaccineRecords');
    tbody.innerHTML = vaccineRecords.map((record, index) => `
        <tr>
            <td>${record.name}</td>
            <td>${record.dose}</td>
            <td>${record.date}</td>
            <td><button onclick="deleteRecord(${index})" class="btn btn-danger btn-sm">Delete</button></td>
        </tr>
    `).join('');
}

function deleteRecord(index) {
    vaccineRecords.splice(index, 1);
    localStorage.setItem('vaccineRecords', JSON.stringify(vaccineRecords));
    updateVaccineTable();
}

// Replace Google Maps initialization with Leaflet
function initMap() {
const map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap contributors'
}).addTo(map);

const searchInput = document.getElementById('locationSearch');

searchInput.addEventListener('keypress', function(e) {
if (e.key === 'Enter') {
    const query = this.value;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}+hospital`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                map.setView([lat, lon], 13);
                
                // Clear existing markers
                map.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });

                // Add markers for hospitals
                data.forEach(location => {
                    const marker = L.marker([location.lat, location.lon])
                        .addTo(map)
                        .bindPopup(`
                            <strong>${location.display_name}</strong><br>
                            Type: ${location.type || 'Hospital'}<br>
                            <button onclick="getDirections(${location.lat}, ${location.lon})" 
                                    class="btn btn-sm btn-primary mt-2">
                                Get Directions
                            </button>
                        `);
                });
            }
        });
}
});
}

function getDirections(lat, lon) {
window.open(`https://www.openstreetmap.org/directions?from=&to=${lat},${lon}`, '_blank');
}

// Call initMap when document is ready
document.addEventListener('DOMContentLoaded', initMap);

// Add this to your existing JavaScript
const API_KEY = 'AIzaSyAP5Wdm2CiiGZymRnxzEokkXJQ7ZnlFa5w';

async function sendMessage() {
const userInput = document.getElementById('userInput');
const message = userInput.value.trim();
if (!message) return;

// Add user message
addMessage(message, 'user');
userInput.value = '';

// Show typing indicator
document.getElementById('typingIndicator').style.display = 'block';

try {
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        contents: [{
            parts: [{
                text: message
            }]
        }]
    })
});

const data = await response.json();
const botResponse = data.candidates[0].content.parts[0].text;

// Hide typing indicator and add bot response
document.getElementById('typingIndicator').style.display = 'none';
addMessage(botResponse, 'bot');

} catch (error) {
console.error('Error:', error);
document.getElementById('typingIndicator').style.display = 'none';
addMessage('Sorry, I encountered an error. Please try again.', 'bot');
}
}

function addMessage(text, sender) {
const chatMessages = document.getElementById('chatMessages');
const messageDiv = document.createElement('div');
messageDiv.className = `message ${sender}`;
messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
chatMessages.appendChild(messageDiv);
chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', (e) => {
if (e.key === 'Enter') sendMessage();
});


// Initialize
updateVaccineTable();
initMap();