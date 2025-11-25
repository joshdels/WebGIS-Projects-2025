var map = L.map('map').setView([0,0], 3);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const API_KEY = '3279289b95f866dea9aba37cd46c379a';

const url = `https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/${API_KEY}/`

L.tileLayer.wms(url, {
  layers: 'fires_viirs_48', 
  format: 'image/png',
  transparent: true,
}).addTo(map);



