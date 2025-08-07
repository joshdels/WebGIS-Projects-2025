let map = L.map('privateMap', {
  zoomControl: false
}).setView([51.505, -0.09], 13);

// Layers
$.getJSON('http://127.0.0.1:8000/location-data/', function(data) {
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
        <p> Hello Private Users</p> 
        `
      );

      // layer.on({
      //   mouseover: function(e) {
      //     e.target.setStyle({
      //       fillColor: "green",
      //       radius: 8
      //     });
      //   },
      //   mouseout: function(e) {
      //     e.target.setStyle({
      //       fillColor: "purple",
      //       radius: 6
      //     });
      //   },
      // });
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
  if (e.shape === 'Marker') {
    const layer = e.layer;

    // 1. Add marker immediately for instant feedback
    layer.addTo(map);

    // 3. Prepare data to send
    const geojson = layer.toGeoJSON();
    const data = { geometry: geojson.geometry };

    // 4. Send save request async
    fetch('/save-location/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        console.log('Success')
      } else {
        // 5b. On failure, update to red and alert
        console.log('Success')
      }
    })
    .catch(err => {
      console.error(err);
    });
  }
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const c = cookie.trim();
      if (c.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(c.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


//Print
L.easyPrint({	
  title: 'Print',
	position: 'topright',
  exportOnly: true,
  hideControlContainer: true,
  filename: 'homify-map',
}).addTo(map);

// Modal
document.querySelectorAll('.edit-bt').forEach(button=> {
  button.addEventListener('click', () => {
  const id = button.getAttribute('data-id');
  console.log(id)

  fetch('/add_location/', {
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.html) {
      document.querySelector('#editModal .modal-content').innerHTML = data.html;
      new bootstrap.Modal(document.getElementById('editModal')).show();
    }
  });
});
  
})
