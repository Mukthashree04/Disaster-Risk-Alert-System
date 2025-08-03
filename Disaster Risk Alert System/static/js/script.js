document.addEventListener('DOMContentLoaded', function() {
    // Hide loading spinner on page load
    document.getElementById('loading').classList.add('hidden');

    // Form submission handler
    document.getElementById('prediction-form').addEventListener('submit', function(event) {
        // Client-side validation
        const temp = parseFloat(document.getElementById('temperature').value);
        const rainfall = parseFloat(document.getElementById('rainfall').value);
        const windSpeed = parseFloat(document.getElementById('wind_speed').value);

        if (isNaN(temp) || isNaN(rainfall) || isNaN(windSpeed)) {
            alert('Please enter valid numbers for all fields.');
            event.preventDefault();
            return;
        }
        if (temp < 0 || temp > 50) {
            alert('Temperature should be between 0 and 50°C.');
            event.preventDefault();
            return;
        }
        if (rainfall < 0 || rainfall > 500) {
            alert('Rainfall should be between 0 and 500mm.');
            event.preventDefault();
            return;
        }
        if (windSpeed < 0 || windSpeed > 200) {
            alert('Wind Speed should be between 0 and 200km/h.');
            event.preventDefault();
            return;
        }

        // Show loading spinner
        document.getElementById('loading').classList.remove('hidden');
    });

    // Fetch weather data
    document.getElementById('fetch-weather').addEventListener('click', function() {
        const city = document.getElementById('city').value.trim();
        if (!city) {
            alert('Please enter a city name.');
            return;
        }

        // Show loading spinner
        document.getElementById('loading').classList.remove('hidden');

        // OpenWeatherMap API
        const apiKey = '6b048d84c8932387a93d2cd147bf18f4'; // Replace with your actual API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('City not found or API error.');
                return response.json();
            })
            .then(data => {
                // Extract weather data
                const temp = data.main.temp; // Temperature in °C
                const rainfall = data.rain ? (data.rain['1h'] || 0) : 0; // Rainfall in mm (last 1 hour)
                const windSpeed = data.wind.speed * 3.6; // Convert m/s to km/h
                const humidity = data.main.humidity; // Humidity in %
                const pressure = data.main.pressure; // Pressure in hPa
                const condition = data.weather[0].description; // Weather condition
                const cityName = `${data.name}, ${data.sys.country}`; // City and country
                const lastUpdated = new Date(data.dt * 1000).toLocaleString(); // Timestamp

                // Populate form fields
                document.getElementById('temperature').value = temp.toFixed(1);
                document.getElementById('rainfall').value = rainfall.toFixed(1);
                document.getElementById('wind_speed').value = windSpeed.toFixed(1);

                // Display weather info
                document.getElementById('weather-info').classList.remove('hidden');
                document.getElementById('city-name').textContent = `City: ${cityName}`;
                document.getElementById('weather-condition').textContent = `Condition: ${condition.charAt(0).toUpperCase() + condition.slice(1)}`;
                document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
                document.getElementById('pressure').textContent = `Pressure: ${pressure} hPa`;
                document.getElementById('last-updated').textContent = `Last Updated: ${lastUpdated}`;

                // Hide loading spinner
                document.getElementById('loading').classList.add('hidden');
            })
            .catch(error => {
                alert(`Error fetching weather: ${error.message}`);
                document.getElementById('weather-info').classList.add('hidden');
                document.getElementById('loading').classList.add('hidden');
            });
    });
});