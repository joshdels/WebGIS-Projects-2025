let map = L.map('map', {
  zoomControl: false
}).setView([13.41, 122.56], 10);

let myLocation = L.marker([7.442619, 125.804142]).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 11,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
