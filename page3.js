
// my coordinates in decimal
var lat = 39.730286;
var lng = -90.246772;

// center the map on my spot
var map = L.map('map').setView([lat, lng], 15);

// load the map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// updated bounds so the bottom of campus shows and the box stays square-ish
var bounds = L.latLngBounds(
    [39.7335, -90.2525], // top-left
    [39.7250, -90.2400]  // bottom-right (extended lower)
);

// lock the map inside those bounds
map.setMaxBounds(bounds);

// stop zooming out too far
map.setMinZoom(16);

// fill the dropdowns
function populateDropdowns() {
    let start = document.getElementById("startSelect");
    let end = document.getElementById("endSelect");

    for (let key in buildings) {
        let b = buildings[key];

        let o1 = document.createElement("option");
        o1.value = key;
        o1.textContent = b.name;
        start.appendChild(o1);

        let o2 = document.createElement("option");
        o2.value = key;
        o2.textContent = b.name;
        end.appendChild(o2);
    }
}

let startMarker = null;
let endMarker = null;

// put a marker on the map
function placeMarker(key, isStart) {
    let b = buildings[key];
    if (!b) return;

    if (isStart) {
        if (startMarker) map.removeLayer(startMarker);
        startMarker = L.marker(b.coords).addTo(map);
    } else {
        if (endMarker) map.removeLayer(endMarker);
        endMarker = L.marker(b.coords).addTo(map);
    }
}

// when dropdown changes, drop a pin
document.getElementById("startSelect").addEventListener("change", function() {
    if (this.value !== "") placeMarker(this.value, true);
});

document.getElementById("endSelect").addEventListener("change", function() {
    if (this.value !== "") placeMarker(this.value, false);
});

// run it
populateDropdowns();