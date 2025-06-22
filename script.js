const apiKey = 'f2ae4518049c4677b57145931252206';




const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const results = document.getElementById('results');

// Enhanced search functionality with better UX
async function searchWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    results.innerHTML = `
      <div class="text-danger">
        <i class="fas fa-exclamation-triangle me-2"></i>
        Please enter a city name.
      </div>
    `;
    return;
  }

  // Show loading state with animation
  results.innerHTML = `
    <div class="loading">
      <div class="d-flex align-items-center justify-content-center">
        <div class="spinner-border spinner-border-sm me-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <span>Fetching weather data...</span>
      </div>
    </div>
  `;

  try {
    // Fetch both current weather and 5-day forecast
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('City not found. Please check the spelling and try again.');
    }
    const data = await response.json();
    const { location, current, forecast } = data;

    // Generate forecast cards
    const forecastCards = forecast.forecastday.map((day, index) => {
      const date = new Date(day.date);
      const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      return `
        <div class="col">
          <div class="forecast-card card h-100 text-center p-3">
            <div class="forecast-day fw-semibold text-primary">${dayName}</div>
            <div class="forecast-date text-muted small mb-2">${monthDay}</div>
            <div class="forecast-icon mb-2">
              <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="img-fluid" />
            </div>
            <div class="forecast-temps mb-2">
              <div class="temp-high fw-bold">${Math.round(day.day.maxtemp_c)}°</div>
              <div class="temp-low text-muted">${Math.round(day.day.mintemp_c)}°</div>
            </div>
            <div class="forecast-condition small text-muted">${day.day.condition.text}</div>
            <div class="forecast-details mt-2 pt-2 border-top">
              <small class="text-muted d-block">
                <i class="fas fa-tint me-1"></i>${day.day.daily_chance_of_rain}%
              </small>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Enhanced weather display with 5-day forecast
    results.innerHTML = `
      <!-- Current Weather -->
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <div class="card current-weather-card p-4 mt-3">
            <div class="text-center">
              <h2 class="mb-3">
                <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                ${location.name}, ${location.country}
              </h2>
              <div class="weather-icon mb-3">
                <img src="https:${current.condition.icon}" alt="${current.condition.text}" class="img-fluid" />
              </div>
              <!-- Temperature Section - Main Highlight -->
              <div class="temperature-section mb-4">
                <h4 class="section-title text-white-50 mb-3">
                  <i class="fas fa-thermometer-half me-2"></i>Current Temperature
                </h4>
                <div class="current-temp display-1 fw-bold text-primary mb-2 temperature-display">
                  ${Math.round(current.temp_c)}°C
                </div>
                <div class="feels-like h6 text-muted mb-2">
                  Feels like ${Math.round(current.feelslike_c)}°C
                </div>
                <div class="current-condition h5 text-muted mb-4">${current.condition.text}</div>
              </div>
              
              <!-- Weather Statistics Section -->
              <div class="stats-section">
                <h5 class="section-title text-white-50 mb-3">
                  <i class="fas fa-chart-bar me-2"></i>Weather Details
                </h5>
                <div class="weather-stats row g-3">
                  <div class="col-6 col-md-3">
                    <div class="stat-card p-3 rounded-3" data-stat="humidity">
                      <i class="fas fa-tint text-primary mb-2"></i>
                      <div class="stat-value fw-bold">${current.humidity}%</div>
                      <div class="stat-label small text-muted">Humidity</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="stat-card p-3 rounded-3" data-stat="wind">
                      <i class="fas fa-wind text-success mb-2"></i>
                      <div class="stat-value fw-bold">${current.wind_kph}</div>
                      <div class="stat-label small text-muted">Wind (km/h)</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="stat-card p-3 rounded-3" data-stat="visibility">
                      <i class="fas fa-eye text-info mb-2"></i>
                      <div class="stat-value fw-bold">${current.vis_km}</div>
                      <div class="stat-label small text-muted">Visibility (km)</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="stat-card p-3 rounded-3" data-stat="pressure">
                      <i class="fas fa-gauge text-warning mb-2"></i>
                      <div class="stat-value fw-bold">${current.pressure_mb}</div>
                      <div class="stat-label small text-muted">Pressure (mb)</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-3 text-muted">
                <small>
                  <i class="fas fa-clock me-1"></i>
                  Last updated: ${new Date(current.last_updated).toLocaleTimeString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Extended Forecast Section -->
      <div class="row justify-content-center mt-5">
        <div class="col-lg-10">
          <div class="forecast-section">
            <div class="section-header text-center mb-4">
              <h3 class="section-title text-white mb-2">
                <i class="fas fa-calendar-week me-2 bounce-icon"></i>5-Day Weather Forecast
              </h3>
              <p class="text-white-50 small">Plan ahead with detailed daily predictions</p>
            </div>
            <div class="forecast-container">
              <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                ${forecastCards}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    results.innerHTML = `
      <div class="text-danger">
        <i class="fas fa-exclamation-circle me-2"></i>
        ${error.message}
      </div>
    `;
  }
}

// Event listeners
searchBtn.addEventListener('click', searchWeather);

// Allow Enter key to trigger search
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchWeather();
  }
});
