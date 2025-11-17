var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

async function getData() {
  const url = 'gadm41_PHL_1.json'
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching ${response.status}`);
    }
    const result = await response.json();
    console.log(result);

    let selectedLayer = null;
    
    const layer = L.geoJSON(result, {
      style: feature => ({ color: 'gray', weight: 2 }),
      onEachFeature: function(feature, layer) {
        layer.on('click', function(e) {
          if (selectedLayer && selectedLayer !== layer) {
            selectedLayer.setStyle({ color: 'gray', weight: 2})
          }
          const isSelected = layer.options.color == "red";
          layer.setStyle({ color: isSelected ? 'gray' : 'red', weight: 3})

          selectedLayer = isSelected ? null : layer;
          
          console.log(feature.properties.NAME_1);
          layer.bindPopup(`${feature.properties.NAME_1}`).openPopup();
        })
      }
    }).addTo(map);

    map.fitBounds(layer.getBounds());

  } catch (error) {
    console.error(error.message);
  }
}

getData(map);

