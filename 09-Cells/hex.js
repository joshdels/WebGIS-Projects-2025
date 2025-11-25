// Create MapLibre basemap
const map = new maplibregl.Map({
  container: "map",
  style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  center: [-122.4, 37.74],
  zoom: 11,
  pitch: 35,
});

// Create a Deck overlay synced with MapLibre
const deckOverlay = new deck.MapboxOverlay({
  interleaved: true,
  layers: []
});

// Add overlay to map
map.addControl(deckOverlay);

// Create the H3 hexagon layer
const h3Layer = new deck.H3HexagonLayer({
  id: "h3-layer",
  data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.h3cells.json",

  extruded: true,
  getHexagon: d => d.hex,
  getFillColor: d => [255, (1 - d.count / 500) * 255, 0],
  getElevation: d => d.count,
  elevationScale: 20,
  pickable: true
});

// Add H3 layer to overlay
map.on("load", () => {
  deckOverlay.setProps({
    layers: [h3Layer]
  });
});
