let map = L.map("myMap").setView([0, 0], 3);

let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution: "© OpenStreetMap",
});

let osmHOT = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution:
      "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France",
  }
);

let esriSat = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    maxZoom: 20,
  }
);

let esriLabels = L.tileLayer(
  "https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 20,
    attribution: "Labels © Esri",
    pane: "overlayPane",
    opacity: 0.9,
  }
);
let googleSat = L.tileLayer(
  "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
  { attribution: "© Google satellite", maxZoom: 20 }
);

let carto = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
  {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20
  }
).addTo(map);

let esriSatewithLabel = L.layerGroup([esriSat, esriLabels]);

let Basemaps = {
  "Carto": carto,
  Openstreet: osm,
  HotMap: osmHOT,
  "Esri": esriSatewithLabel,
  "Google": googleSat,
};

let markers = L.markerClusterGroup({
  iconCreateFunction: function(cluster) {
    let count = cluster.getChildCount();

    let radius = Math.min(80, 30 + count);

    return L.divIcon({
      html: `<div style="width:${radius}px;height:${radius}px;line-height:${radius}px;">${count}</div>`,
      className: "custom-cluster",
      iconSize: L.point(radius, radius)
    });
  }
});

//style switches
function getIcon(type) {
  let iconHtml = '';
  let iconColor = '';

  switch(type) {
    case 'cafe':
      iconHtml = '<i class="fa-solid fa-mug-saucer"></i>';
      iconColor = 'chocolate';
      break
    default:
      iconHtml = '<i class="fas fa-map-marker-alt"></i>';
      iconColor = 'black';
  }
  return L.divIcon({
    html: `<div style="color: ${iconColor}; font-size: 24px;">${iconHtml}</div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
}


// Data
let geojsonLayer;

// Data handler - only loads if geojsonPath is available
function loadData(path){
  // Clear previous layers
  markers.clearLayers(); // Clear old markers
  if (geojsonLayer) map.removeLayer(geojsonLayer); // Remove old GeoJSON layer

  fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      geojsonLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {
            icon: getIcon(feature.properties.amenity)
          });
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(`
            <h4 class="text-center"><i class="fas fa-map-marker-alt"></i> Location</h4> 
            <hr></hr>
            <p class="text-center"> ${feature.properties.name}</p>
          `);
        },
      });
      
      // Add to cluster layer
      map.addLayer(markers);
      markers.addLayer(geojsonLayer);

      // Zoom to extent
      map.fitBounds(geojsonLayer.getBounds());
    })
    .catch((error) => {
      console.log(`No data available or error loading data: ${error}`);
    });
}

loadData(geojsonPath);

//Scales
L.control.scale({ position: "bottomleft" }).addTo(map);

//Layer controls
L.control.layers(Basemaps).addTo(map);

//Layer Extent
L.Control.FullExtent = L.Control.extend({
  onAdd: function(map) {
    let btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
    btn.innerHTML = '<i class="fa-solid fa-house"></i>';
    btn.title = 'Zoom to Full Extent';
    btn.style.width = '35px';
    btn.style.height = '35px';

    L.DomEvent.on(btn, 'click', function() {
      map.fitBounds(geojsonLayer.getBounds());
    });

    return btn;
  }
});

L.control.fullExtent = function(opts) {
  return new L.Control.FullExtent(opts);
}

L.control.fullExtent({ position: 'topleft' }).addTo(map);

//Legend
const legend = L.control({position: 'topleft'})

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');

  const types = {
    cafe: { icon: 'fas fa-mug-saucer', color: 'chocolate' },
    };

  div.innerHTML = "<h6>Legend</h6>"
  // Loop through each type and generate label with colored square
  for (let type in types) {
    div.innerHTML += `
      <i class="${types[type].icon}" style="color:${types[type].color}; margin-right:8px;"></i>
      ${type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}<br/>
    `;
  }

  return div;
};

legend.addTo(map);

