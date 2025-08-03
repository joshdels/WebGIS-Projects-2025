let map = L.map('map').setView([51.505, -0.09], 13);


// Layers
$.getJSON('./data/boundarys.geojson', function(data) {
  let boundary = L.geoJSON(data).addTo(map);
  map.fitBounds(boundary.getBounds())
})

$.getJSON('./data/point.geojson', function(data) {
  let points = L.geoJSON(data).addTo(map)
})



// Basemaps
let satellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 19,
}).addTo(map);

let terrain = L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', {
  maxZoom: 19,
}).addTo(map);


var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

let basemaps = {
  "Satellite": satellite,
  "Terrain": terrain,
  "Voyager": CartoDB_Voyager,
}

L.control.layers(basemaps, null, {
  position: 'topright'
}).addTo(map);

