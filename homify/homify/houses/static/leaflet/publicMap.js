let map = L.map('map', {
  zoomControl: false
}).setView([51.505, -0.09], 13);

// Layers
let locationLayer;
$.getJSON('http://127.0.0.1:8000/location-data/', function(data) {
  if (locationLayer) {
    map.removeLayer(locationLayer);
  }

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
      layer.bindPopup(
        `
        <div class="card shadow border-0" style="width: 100%; max-width: 18rem;">
          <img src="{% static 'leaflet/img/istockphoto-876864896-612x612.jpg' %}" class="card-img-top img-fluid" alt="Preview image">
             <div class="card-body">
                <h5 class="mb-2" id="card-header">₱500/month</h5>
                <p class="m-0 mb-1" id="card-text-1"> <strong>Studio</strong> | <strong>50</strong> sqm  | <strong>3</strong> beds</p>
                <p class="m-0" id="card-text-2"> 100 Philippines, Prk Apokon Tagum City, Davao del Norte</p>
              </div>
            
            <button class="btn btn-primary open-modal-btn w-100" data-id="${feature.id}">View Details</button>
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

$.getJSON('http://127.0.0.1:8000/boundary-data/', function(data) {
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



