// ===============================
// MAP SETUP
// center the map on my coordinates
// ===============================
var lat = 39.730286;
var lng = -90.246772;

// make the map + center it
var map = L.map('map').setView([lat, lng], 15);

// load the map tiles (basic OSM layer)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// ===============================
// MAP BOUNDS (so you can't scroll off campus)
// ===============================
var bounds = L.latLngBounds(
    [39.7335, -90.2525], // top-left
    [39.7250, -90.2400]  // bottom-right (extended lower)
);

// lock the map inside those bounds
map.setMaxBounds(bounds);

// stop zooming out too far
map.setMinZoom(16);


// ===============================
// DROPDOWN SETUP
// fill the dropdowns with building names
// ===============================
function populateDropdowns() {
    let start = document.getElementById("startSelect");
    let end = document.getElementById("endSelect");

    for (let key in buildings) {
        let b = buildings[key];

        // start option
        let o1 = document.createElement("option");
        o1.value = key;
        o1.textContent = b.name;
        start.appendChild(o1);

        // end option
        let o2 = document.createElement("option");
        o2.value = key;
        o2.textContent = b.name;
        end.appendChild(o2);
    }
}

let startMarker = null;
let endMarker = null;


// ===============================
// PLACE MARKERS
// drop a pin when a building is selected
// ===============================
function placeMarker(key, isStart) {
    let b = buildings[key];
    if (!b) return; // safety check

    if (isStart) {
        if (startMarker) map.removeLayer(startMarker);
        startMarker = L.marker(b.coords).addTo(map);
    } else {
        if (endMarker) map.removeLayer(endMarker);
        endMarker = L.marker(b.coords).addTo(map);
    }
}


// ===============================
// DROPDOWN LISTENERS
// when user picks a building → drop pin + update walk time
// ===============================
document.getElementById("startSelect").addEventListener("change", function() {
    if (this.value !== "") placeMarker(this.value, true);
    updateWalkBox();
});

document.getElementById("endSelect").addEventListener("change", function() {
    if (this.value !== "") placeMarker(this.value, false);
    updateWalkBox();
});

// run dropdown fill on load
populateDropdowns();


// ===============================
// WEATHER CODE → TEXT
// converts weathercode numbers into readable text
// ===============================
function getWeatherText(code) {
    if (code >= 0 && code <= 3) return "Clear / Cloudy";
    if (code >= 45 && code <= 48) return "Fog";
    if (code >= 51 && code <= 57) return "Drizzle";
    if (code >= 61 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 85 && code <= 86) return "Snow Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Unknown";
}


// ===============================
// WEATHER FUNCTION
// pulls Jacksonville weather from Open-Meteo
// ===============================
function loadWeather() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=39.733&longitude=-90.229&current_weather=true";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weather = data.current_weather;

            // save weather so walk time can use it
            window.lastWeather = weather;

            document.getElementById("temp").innerText =
                "Temperature: " + weather.temperature + "°C";

            document.getElementById("wind").innerText =
                "Wind: " + weather.windspeed + " km/h";

            document.getElementById("condition").innerText =
                "Condition: " + getWeatherText(weather.weathercode);

            updateWalkBox(); // update if markers already selected
        })
        .catch(error => {
            document.getElementById("temp").innerText = "Error loading weather";
            console.log(error);
        });
}

// run weather on load
loadWeather();


// ===============================
// DISTANCE + WALK TIME
// simple rough math (good enough for campus)
// ===============================

// rough distance in meters
function getDistanceRough(lat1, lon1, lat2, lon2) {
    const latDist = Math.abs(lat2 - lat1) * 111000; // meters per degree
    const lonDist = Math.abs(lon2 - lon1) * 85000;  // meters per degree (Illinois)
    return Math.sqrt(latDist * latDist + lonDist * lonDist);
}

// rough walk time with weather adjustments
function getWalkTimeRough(distance, weather) {
    let speed = 1.4; // normal walking speed m/s

    // wind slows you down
    if (weather.windspeed > 15) speed -= 0.2;
    if (weather.windspeed > 25) speed -= 0.3;

    // cold or hot slows you down
    if (weather.temperature < 32) speed -= 0.2;
    if (weather.temperature > 85) speed -= 0.2;

    // rain or snow slows you down
    if (weather.weathercode >= 60 && weather.weathercode < 70) speed -= 0.3; // rain
    if (weather.weathercode >= 70) speed -= 0.4; // snow

    if (speed < 0.8) speed = 0.8; // don't let it get too slow

    const seconds = distance / speed;
    return Math.round(seconds / 60);
}


// ===============================
// UPDATE WALK BOX
// updates distance + time when both markers exist
// ===============================
function updateWalkBox() {
    if (!startMarker || !endMarker) return;

    const s = startMarker.getLatLng();
    const e = endMarker.getLatLng();

    const dist = getDistanceRough(s.lat, s.lng, e.lat, e.lng);
    const distFeet = (dist * 3.28084).toFixed(0);

    document.getElementById("walkDistance").innerText =
        "Distance: " + distFeet + " ft";

    if (window.lastWeather) {
        const mins = getWalkTimeRough(dist, window.lastWeather);
        document.getElementById("walkTime").innerText =
            "Time: " + mins + " min";
    }
}
