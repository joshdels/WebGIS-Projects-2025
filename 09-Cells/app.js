const map = new maplibregl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  center: [0.45, 51.47],
  zoom: 11,
  antialias: true
});

map.on('load', () => {
  const { MapboxOverlay, ScatterplotLayer } = deck;

  const deckOverlay = new MapboxOverlay({
    interleaved: true,
    layers: [
      new ScatterplotLayer({
        id: 'circle-layer',
        data: [{ position: [0.45, 51.47] }],
        getPosition: d => d.position,
        getFillColor: [255, 0, 0, 200],
        getRadius: 250
      })
    ]
  });

  map.addControl(deckOverlay);
});
