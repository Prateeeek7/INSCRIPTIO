
        // Gemini API Integration
        const GEMINI_API_KEY = "AIzaSyAP5Wdm2CiiGZymRnxzEokkXJQ7ZnlFa5w";
        const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

        // Symptom Analysis
        document.getElementById('analyzeBtn').addEventListener('click', analyzeSymptoms);

        async function analyzeSymptoms() {
            const symptoms = document.getElementById('symptoms').value.trim();
            if (!symptoms) {
                alert("Please describe your symptoms.");
                return;
            }

            try {
                // Call Gemini API for symptom analysis
                const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: `Analyze these symptoms and suggest a medical department: ${symptoms}` }]
                        }]
                    })
                });

                const data = await response.json();

                // Extract the AI-generated response
                const suggestions = data.candidates?.[0]?.content?.parts?.[0]?.text || "No specific department found.";
                
                // Display the result
                document.getElementById('suggestionText').textContent = suggestions;
                document.getElementById('departmentSuggestions').style.display = 'block';
            } catch (error) {
                console.error("Error analyzing symptoms:", error);
                alert("Failed to analyze symptoms. Please try again later.");
            }
        }

        // Proceed to Hospital Selection
        document.getElementById('proceedToHospitals').addEventListener('click', () => {
            document.getElementById('hospitalSection').style.display = 'block';
            initMap();
        });

        // Initialize OpenStreetMap with Leaflet
        let map;
        function initMap() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    // Initialize map
                    map = L.map('map').setView([lat, lng], 14);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(map);
                    // Search nearby hospitals
                    searchNearbyHospitals(lat, lng);
                });
            }
        }

        // Search hospitals using Overpass API
        async function searchNearbyHospitals(lat, lng) {
            const radius = 5000; // 5km radius
            const query = `
                [out:json];
                node["amenity"="hospital"](around:${radius},${lat},${lng});
                out body;
                >;
                out skel qt;
            `;
            try {
                const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
                const data = await response.json();
                showHospitals(data.elements);
            } catch (error) {
                console.error("Error fetching hospitals:", error);
            }
        }

        function showHospitals(hospitals) {
            const hospitalList = document.getElementById('hospitalList');
            hospitalList.innerHTML = hospitals.map(hospital => {
                const name = hospital.tags.name || "Unnamed Hospital";
                const street = hospital.tags["addr:street"] || "";
                const city = hospital.tags["addr:city"] || "";
                const state = hospital.tags["addr:state"] || "";
                const postcode = hospital.tags["addr:postcode"] || "";

                // Construct full address
                const address = [street, city, state, postcode].filter(Boolean).join(", ");

                return `
                    <div class="col-md-6 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <h5>${name}</h5>
                                <p><strong>Address:</strong> ${address || "Address not available"}</p>
                                <button onclick="bookAppointment('${hospital.id}')" 
                                    class="btn btn-primary">Book Appointment</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function bookAppointment(hospitalId) {
            alert(`Appointment booked for hospital ID: ${hospitalId}`);
        }

        // Blood Tests Booking
        document.getElementById('bookTestBtn').addEventListener('click', () => {
            const selectedTest = document.getElementById('testType').value;
            if (!selectedTest) {
                alert("Please select a test.");
                return;
            }
            document.getElementById('selectedTest').textContent = document.getElementById('testType').options[document.getElementById('testType').selectedIndex].text;
            document.getElementById('testConfirmation').style.display = 'block';
        });

        // Online Pharmacy
        document.getElementById('orderMedicineBtn').addEventListener('click', () => {
            const medicineName = document.getElementById('medicineName').value.trim();
            if (!medicineName) {
                alert("Please enter a medicine name.");
                return;
            }
            document.getElementById('orderedMedicine').textContent = medicineName;
            document.getElementById('medicineConfirmation').style.display = 'block';
        });

        // Insurance Management
        document.getElementById('checkInsuranceBtn').addEventListener('click', () => {
            const policyNumber = document.getElementById('policyNumber').value.trim();
            if (!policyNumber) {
                alert("Please enter a policy number.");
                return;
            }
            document.getElementById('insuranceResult').textContent = "Active";
            document.getElementById('insuranceStatus').style.display = 'block';
        });

        // Health Records Upload
        document.getElementById('uploadRecordsBtn').addEventListener('click', () => {
            const fileInput = document.getElementById('healthRecords');
            if (!fileInput.files.length) {
                alert("Please select a file to upload.");
                return;
            }
            document.getElementById('uploadedFileName').textContent = fileInput.files[0].name;
            document.getElementById('uploadConfirmation').style.display = 'block';
        });
