const {DeckGL, H3HexagonLayer} = deck;

// Create H3 layer
const h3Layer = new H3HexagonLayer({
  id: 'H3HexagonLayer',
  data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.h3cells.json',
  extruded: true,
  elevationScale: 20,
  getHexagon: d => d.hex,
  getFillColor: d => [255, (1 - d.count / 500) * 255, 0],
  getElevation: d => d.count,
  pickable: true,
  wireframe: false
});

// Initialize DeckGL
new DeckGL({
  container: 'map',
  mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // your MapLibre-style basemap
  initialViewState: {
    longitude: -122.4,
    latitude: 37.74,
    zoom: 11,
    pitch: 30,
    bearing: 0
  },
  controller: true,
  layers: [h3Layer],
  getTooltip: ({object}) => object && `${object.hex} count: ${object.count}`
});