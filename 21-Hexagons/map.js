// MapLibre basemap
const map = new maplibregl.Map({
  container: "map",
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center: [121.003, 14.6282],
  zoom: 6,
});

// Deck overlay
const deckOverlay = new deck.MapboxOverlay({ interleaved: true, layers: [] });
map.addControl(deckOverlay);

// FEW COLORS ONLY (3-level choropleth)
function getHexColor(count) {
  if (count > 30000) return [179, 0, 0];        // Deep Red (High)
  if (count > 10000) return [255, 102, 0];      // Orange (Medium)
  if (count > 5000)  return [0, 102, 204];      // Strong Blue (Low)
  return [102, 178, 255];                       // Light Blue (Very Low)
}

// Load GeoJSON → H3 bins
async function loadGeoJSONtoH3() {
  const res = await fetch("data/schools.geojson");
  const geo = await res.json();
  const resolution = 5;
  const hexMap = {};

  geo.features.forEach(f => {
    const [lng, lat] = f.geometry.coordinates;
    const hex = h3.latLngToCell(lat, lng, resolution);

    if (!hexMap[hex]) hexMap[hex] = { hex, count: 0, properties: [] };
    hexMap[hex].count += f.properties.Total_Enro || 1;
    hexMap[hex].properties.push(f.properties);
  });

  return Object.values(hexMap);
}

map.on("load", async () => {
  const h3Data = await loadGeoJSONtoH3();

const schoolHexLayer = new deck.H3HexagonLayer({
  id: "school-hex-layer",
  data: h3Data,

  extruded: false,              // FLAT HEXAGONS
  pickable: true,
  getHexagon: d => d.hex,

  // Fill color
  getFillColor: d => getHexColor(d.count),

  // OUTLINES
  getLineColor: [0, 0, 0],      // black outline
  getLineWidth: 200,             // outline width in meters

  // Tooltip
  getTooltip: ({ object }) =>
    object && `${object.properties.length} schools\nTotal Enrollment: ${object.count}`,

  // Hover panel
  onHover: ({ object, x, y }) => {
    const panel = document.getElementById("panel");
    if (object) {
      const color = getHexColor(object.count);
      panel.innerHTML = `
        <strong>${object.properties.length} schools</strong><br>
        Total Enrollment: ${object.count}<br>
        <div style="width:50px; height:20px; background: rgb(${color[0]}, ${color[1]}, ${color[2]});"></div>
      `;
      panel.style.display = "block";
      panel.style.left = `${x + 10}px`;
      panel.style.top = `${y + 10}px`;
      panel.style.padding = "8px";
      panel.style.background = "rgba(255,255,255,0.9)";
      panel.style.borderRadius = "4px";
      panel.style.fontSize = "12px";
    } else {
      panel.style.display = "none";
    }
  }
});


  deckOverlay.setProps({ layers: [schoolHexLayer], controller: true });
});
