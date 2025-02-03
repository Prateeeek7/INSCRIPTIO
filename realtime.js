
        // Initialize map
        const map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Fetch WHO data
        async function fetchWHOData() {
            try {
                // Replace with actual WHO API endpoint
                const response = await fetch('WHO_API_ENDPOINT');
                const data = await response.json();
                updateDashboard(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        function updateDashboard(data) {
            // Update statistics and map markers
            // This is where you'll process the WHO data
        }

        // Update data every 5 minutes
        fetchWHOData();
        setInterval(fetchWHOData, 300000);
            // Air Quality Monitoring
    async function fetchAirQuality() {
        try {
            const response = await fetch('https://api.openaq.org/v2/latest?limit=100');
            const data = await response.json();
            updateAirQualityData(data.results);
        } catch (error) {
            console.error('Error fetching air quality:', error);
        }
    }

    function updateAirQualityData(data) {
        data.forEach(location => {
            // Add markers to map
            const marker = L.marker([location.coordinates.latitude, location.coordinates.longitude])
                .bindPopup(`
                    <h3>${location.location}</h3>
                    <p>PM2.5: ${location.measurements.find(m => m.parameter === 'pm25')?.value || 'N/A'} µg/m³</p>
                    <p>Last Updated: ${new Date(location.measurements[0].lastUpdated).toLocaleString()}</p>
                `);
            marker.addTo(map);
        });
    }
        // Water Quality Monitoring
        async function fetchWaterQuality() {
        try {
            // Using USGS Water Quality API as example
            const response = await fetch('https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500&parameterCd=00400,00095');
            const data = await response.json();
            updateWaterQualityData(data);
        } catch (error) {
            console.error('Error fetching water quality:', error);
        }
    }

    function updateWaterQualityData(data) {
        // Process and display water quality data
        const waterQualityDiv = document.getElementById('waterQuality');
        // Update UI with water quality information
    }

    // Update dashboard with all metrics
    function updateDashboard(data) {
        // WHO Disease data
        const diseaseData = document.getElementById('diseaseData');
        diseaseData.innerHTML = data.map(item => `
            <tr>
                <td>${item.disease}</td>
                <td>${item.cases}</td>
                <td>${item.region}</td>
            </tr>
        `).join('');

        // Update metrics
        document.getElementById('globalCases').textContent = data.totalCases;
        document.getElementById('activeOutbreaks').textContent = data.activeOutbreaks;
    }

    // Initialize all data fetching
    fetchWHOData();
    fetchAirQuality();
    fetchWaterQuality();

    // Set update intervals
    setInterval(fetchWHOData, 300000);
    setInterval(fetchAirQuality, 600000);
    setInterval(fetchWaterQuality, 900000);
