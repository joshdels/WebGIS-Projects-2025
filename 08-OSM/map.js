const form = document.getElementById('locationForm');
const input = document.getElementById('locationInput');
const city = document.getElementById('city')
const numberOfRestaurant = document.getElementById('restaurant');

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let value = input.value
  value = value.charAt(0).toUpperCase() + value.slice(1);
  city.innerHTML = `Restaurants in ${value}`
  getData(value);

})

var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let currentLayer = null;

async function getData(location) {
  const url = "https://overpass-api.de/api/interpreter"

  const query = `
    [out:json][timeout:25];
    area["name"="${location}"]->.searchArea;
    node["amenity"="restaurant"](area.searchArea);
    out;
  `;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      body: query,
    });
    if (!response.ok) {
      throw new Error(`Error fetching ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    numberOfRestaurant.innerHTML = 
      result.elements.length > 0
      ? `Current Number: ${result.elements.length}` 
      : `No restaurants found`;

    const geo = {
      type: "FeatureCollection",
      features: result.elements.map(n => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [n.lon, n.lat],
        },
        properties: n.tags
      }))
    }

    if (currentLayer) {
      map.removeLayer(currentLayer);
    }

    let selectedLayer = null;
    
    currentLayer = L.geoJSON(geo, {
      pointToLayer: (feature, latlng) =>
        L.circleMarker(latlng, {radius: 5, color: "blue"}),
      
      onEachFeature: function(feature, layer) {
        layer.on('click', function(e) {
          if (selectedLayer && selectedLayer !== layer) {
            selectedLayer.setStyle({ color: 'blue'})
          }
          const isSelected = layer.options.color == "red";
          layer.setStyle({ color: isSelected ? 'blue' : 'red'})

          selectedLayer = isSelected ? null : layer;
          
          console.log(feature.properties.name);
          layer.bindPopup(`${feature.properties.name}`).openPopup();
        })
      }
    }).addTo(map);

    if (geo.features.length > 0) {
      map.fitBounds(currentLayer.getBounds());
    }

  } catch (error) {
    console.error(error.message);
  }
}


