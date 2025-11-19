var map = L.map('map').setView([0,0], 3);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const API_KEY = 'YOUR FIRMS API KEY ';

const url = `https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/${API_KEY}/`

L.tileLayer.wms(url, {
  layers: 'fires_viirs_24', 
  format: 'image/png',
  transparent: true,
}).addTo(map);



