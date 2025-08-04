let map = L.map('map', {
  zoomControl: false
}).setView([51.505, -0.09], 13);

// Layers
$.getJSON('./data/point.geojson', function(data) {
  let location = L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        color: "white",
        fillColor: "purple",
        fillOpacity: 1,
        fill: true,
        radius: 6,
        interactive: true
      })
    },
    onEachFeature: function(feature, layer) {
      let property = feature.properties;
      layer.bindPopup(
        `
        <div class="card shadow border-0" style="width: 100%; max-width: 18rem;">
          <img src="./img/istockphoto-876864896-612x612.jpg" class="card-img-top img-fluid" alt="Preview image">
          <div class="card-body">
            <p class="card-text mb-2">
              <strong>ID:</strong> ${property.id}
            </p>
            <button class="btn btn-primary open-modal-btn w-100" data-id="${property.id}">View Details</button>
          </div>
        </div>
        `
      );

      layer.on({
        mouseover: function(e) {
          e.target.setStyle({
            fillColor: "green",
            radius: 8
          });
        },
        mouseout: function(e) {
          e.target.setStyle({
            fillColor: "purple",
            radius: 6
          });
        },
      });
    }
  }).addTo(map)
});

$.getJSON('./data/davao.geojson', function(data) {
  let boundary = L.geoJSON(data, {
    style: {
      color: "black",
      fillOpacity: 0,
      weight: 1,
      dashArray: '2,4'
    },
    interactive: false
  }).addTo(map);
  map.fitBounds(boundary.getBounds())
})


// Basemaps
let terrain = L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', {
  maxZoom: 19,
}).addTo(map);

let satellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 19,
})



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
  position: 'bottomright'
}).addTo(map);

L.control.zoom({
  position: 'topright'
}).addTo(map);

//Adding draw functions
map.pm.addControls({
  position: 'topright',
  oneBlock: true,
  drawCircle: false,
  drawPolygon: false,
  drawPolyline: false,
  drawCircleMarker: false,
  drawRectangle: false,
  drawMarker: true,
  drawText: false,
  cutPolygon: false,
  rotateMode: false,
  editMode: false,

});

map.on('pm:create', e => {
  // console.log(JSON.stringify(e.layer.toGeoJSON()));
});

//Print
L.easyPrint({	
  title: 'Print',
	position: 'topright',
  exportOnly: true,
  hideControlContainer: true,
  filename: 'homify-map',
}).addTo(map);


// Modals
map.on('popupopen', function () {
  // Allow time for the DOM to render the popup
  setTimeout(() => {
    const modalBtn = document.querySelector('.open-modal-btn');
    if (modalBtn) {
      modalBtn.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
        modal.show();
      });
    }
  }, 0);
});