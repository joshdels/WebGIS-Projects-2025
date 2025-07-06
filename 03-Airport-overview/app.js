require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/PopupTemplate",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/widgets/Home",
  "esri/layers/GeoJSONLayer",
], function (
  esriConfig,
  Map,
  MapView,
  PopupTemplate,
  Legend,
  Expand,
  Home,
  GeoJSONLayer
) {
  //API
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurFqQ61x9cGnw88FPfWt2DoxASckmLACOn-AUhGMilYabU8I9Y3E6Y1KV9s9QyuykiSZvXowrXyyu0zrO_IhKbpMNXAvvxvNeeidKfdfBa5M6umAjryN60lyjygMpUmUgMb7CX-C34h0yOCtEKNZEjrKOPg24jZIi4ry7j64UR8errlHCIMwjXOhLyQpxUELOO229hcCFvy9oKSpMDVGBuhk.AT1_UhnG8Nri";

  // BaseMap
  const map = new Map({
    basemap: "gray-vector",
  });

  //Constraint Extent
  const philippinesExtent = {
    type: "extent",
    xmin: 116.87,
    ymin: 4.59,
    xmax: 126.6,
    ymax: 21.35,
    spatialReference: {
      wkid: 4326,
    },
  };

  //View
  const view = new MapView({
    container: "myView",
    map: map,
    center: [0, 0],
    zoom: 1,
    constraints: {
      geometry: philippinesExtent,
      minZoom: 2,
      maxZoom: 15
    },
  });

  //Pop up
  const popUp = new PopupTemplate({
    title: "✈️ {name}",
    content: "{expression/description}",
    expressionInfos: [
      {
        name: "description",
        expression: 
        `Concatenate([
          'This is a ', 
          Replace($feature.type, '_', ' '), 
          ' with an area of ', 
          Round($feature.AREA_SQKM, 2), 
          ' sq km.'
        ])`
      }
    ]
  });

  // Cluster
  const renderer = {
    type: "unique-value",
    field: "type",
    uniqueValueInfos: [
      {
        value: "large_airport",
        label: "Large Airport",
        symbol: {
          type: "simple-marker",
          style: "circle",
          color: "yellow",
          size: 30,
          outline: {
            color: "black",
            width: 0.5,
          },
        },
      },
      {
        value: "medium_airport",
        label: "Medium Airport",
        symbol: {
          type: "simple-marker",
          style: "circle",
          color: "green",
          size: 15,
          outline: {
            color: "black",
            width: 0.5,
          },
        },
      },
      {
        value: "small_airport",
        label: "Small Airport",
        symbol: {
          type: "simple-marker",
          style: "circle",
          color: "blue",
          size: 8,
          outline: {
            color: "black",
            width: 0.5,
          },
        },
      },
    ],
    defaultSymbol: {
      type: "simple-marker",
      style: "circle",
      color: "gray",
      size: 5,
      outline: {
        color: "black",
        width: 0.5,
      },
    },
    defaultLabel: "Other",
  };

  const clusterConfig = {
    type: "cluster",
    clusterMinSize: 16,
    labelingInfo: [
      {
        deconflictionStrategy: "none",
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '####')",
        },
        symbol: {
          type: "text",
          color: "white",
          font: {
            family: "Noto Sans",
            size: "12px",
            weight: "bold",
          },
        },
        labelPlacement: "center-center",
      },
    ],
    symbol: {
      type: "simple-marker",
      size: 6,
      color: "red",
      outline: {
        color: "black",
        width: 0.5,
      },
    },
  };

  
  //// DATA
  const layer = new GeoJSONLayer({
    title: "Stations",
    url: "data/airports.geojson",
    opacity: 0.7,
    popupTemplate: popUp,
    renderer: renderer,
    featureReduction: clusterConfig,
  });

  map.add(layer);
  
  ///// Widgets
  // Expand
  const expandLegend = new Expand({
    expandIcon: "plane",
    content: document.getElementById("infoDiv"),
    view: view,
    expanded: false,
  });
  //Home View
  const homeWidget = new Home({
    view: view,
    viewpoint: {
      targetGeometry: philippinesExtent
    },
  })
  
  view.ui.add(expandLegend, "top-right");
  view.ui.add(homeWidget, "top-left");
  
  // Legend
  let legend = new Legend({
    view: view,
    container: "legendDiv",
  });
  
  // Zoom to Layer Exten when Ready
  layer.when(() => {
    if (layer.fullExtent) {
      view.goTo(layer.fullExtent);
    }
  });

// For toggle the cluster enable/disable
let toggleButton = document.getElementById("toggle-cluster");
toggleButton.addEventListener("click", () => {
  const clusteringIsActive = layer.featureReduction !== null;
  if (clusteringIsActive) {
    layer.featureReduction = null;
    toggleButton.innerText = "Enabled Clustering";
  } else {
    layer.featureReduction = clusterConfig;
    toggleButton.innerText = "Disabled Clustering";
  }
});

//change filters
const filterDropdown = document.getElementById("filter");
filterDropdown.addEventListener("change", (event)=>{
  console.log(event);
  const selectedType = event.target.value;
  

  if (selectedType=== ""){
    layer.definitionExpression = null
  } else {
    layer.definitionExpression = `type = '${selectedType}'`
  }
})

});
