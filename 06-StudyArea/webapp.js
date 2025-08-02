// test is a test update for github?
let map = L.map('map').setView([0, 0], 4);

// Base Maps
let OSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let googleSatellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}');

// Your data
let studyArea, contours, chainages, streamOrder;
$.when(
  //contours
  $.getJSON('./data/contour.geojson', function(data) {
    contours = L.geoJSON(data, {
      style: {
        color: "#00ff22ff",
        weight: 0.6,
        dashArray: '10,10'
      },
    }).addTo(map);
  }),
  //stream
  $.getJSON('./data/Stream_Order.geojson', function(data) {
    streamOrder = L.geoJSON(data, {  
      style: {
        color: "#0527e9ff",
        weight: 3
      }}).addTo(map);
  }),
  //study ARea
  $.getJSON('./data/Study_Area.geojson', function(data) {
    studyArea = L.geoJSON(data, {
      style: {
        color: "black",
      }
    }).addTo(map);
    map.fitBounds(studyArea.getBounds());
  }),
  //chainages
  $.getJSON('./data/Chainages.geojson', function(data) {
    chainages = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          fillColor: "#ff0000ff",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 1
        })
      },
    }).addTo(map);
  }),
).then(() => {

//Control Panels
let baseMaps = {
  "Open Street Map": OSM,
  "Google Satellite": googleSatellite
};

let overlayMaps = {
  "Chainages": chainages,
  "Contours": contours,
  "Stream Order": streamOrder,
  "Study Area": studyArea,
};

  L.control.layers(baseMaps, overlayMaps, 
    { 
      collapsed: false
    }
  ).addTo(map);
}).catch(err => {
  console.error("Error loading GeoJSON files:", err);
});

// Legend
L.control.Legend({
    position: "bottomleft",
    symbolWidth: 24,
    collapsed: false,
    column: 1,
    opacity: 1,
    legends: [
      {
        label: "Chainages",
        type: "circle",
        radius: 5,
        color: "000",
        fillColor: "#ff0000ff",
        fillOpacity: 1
      },
      {
        label: "Stream Order",
        type: "polyline",
        color: "#0527e9ff",
        weight:3,
      },
      {
        label: "Contours",
        type: "polyline",
        color: "#00ff22ff",
        fillColor: "#00ff22ff",
        dashArray: [5,5],
        weight: 0.6
      },
      {
        label: "Study Area",
        type: "rectangle",
        color: "black",
        fillColor: "black",
        fillOpacity: 0.2,
      }
    ]
}).addTo(map);

//Layer Extent
L.Control.FullExtent = L.Control.extend({
  onAdd: function(map) {
    let btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
    btn.innerHTML = '<i class="fa-solid fa-house"></i>';
    btn.title = 'Zoom to Full Extent';
    btn.style.width = '35px';
    btn.style.height = '35px';

    L.DomEvent.on(btn, 'click', function() {
      map.fitBounds(studyArea.getBounds());
    });

    return btn;
  }
});

new L.Control.FullExtent({position: 'topleft'}).addTo(map)