const { HexagonLayer, MapboxOverlay } = deck;

const layer = new HexagonLayer({
  id: 'HexagonLayer',
  data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json',
  gpuAggregation: true,
  extruded: true,
  getPosition: d => d.COORDINATES, 
  getColorWeight: d => d.SPACES,
  getElevationWeight: d => d.SPACES,
  elevationScale: 4,
  radius: 200,
  pickable: true
});

new Deck({
  container: 'map', // add container
  initialViewState: {
    longitude: -122.4,
    latitude: 37.74,
    zoom: 11
  },
  controller: true,
  getTooltip: ({object}) => object && `Count: ${object.elevationValue}`,
  layers: [layer]
});



// const map = new maplibregl.Map({
//   container: 'map',
//   style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
//   center: [-122.4, 37.74],
//   zoom: 12,
//   bearing: 0,
//   pitch: 30
// });

// map.once('load', () => {
//   const hexLayer = new HexagonLayer({
//     id: 'hex-layer',
//     data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json',
//     extruded: true,
//     radius: 200,
//     getPosition: d => d.COORDINATES, // must be lowercase
//     getColorWeight: d => d.SPACES,   // must be lowercase
//     getElevationWeight: d => d.SPACES,
//     elevationScale: 4,
//     pickable: true
//   });

//   const deckOverlay = new MapboxOverlay({
//     layers: [hexLayer],
//     interleaved: false
//   })
  
//   map.addControl(deckOverlay);
// });



