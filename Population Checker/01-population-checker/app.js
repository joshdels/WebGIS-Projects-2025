require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer",
  "esri/renderers/ClassBreaksRenderer",
  "esri/widgets/Legend",
  "esri/widgets/Home",
  "esri/rest/support/Query",
  "esri/Graphic",
], function (
  esriConfig,
  Map,
  MapView,
  GeoJSONLayer,
  ClassBreaksRenderer,
  Legend,
  Home,
  Query,
  Graphic
) {
  // API
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurFqQ61x9cGnw88FPfWt2DoxASckmLACOn-AUhGMilYabU8I9Y3E6Y1KV9s9QyuykiSZvXowrXyyu0zrO_IhKbpMNXAvvxvNeeidKfdfBa5M6umAjryN60lyjygMpUmUgMb7CX-C34h0yOCtEKNZEjrKOPg24jZIi4ry7j64UR8errlHCIMwjXOhLyQpxUELOO229hcCFvy9oKSpMDVGBuhk.AT1_UhnG8Nri";

  // Renderer
  let populationRenderer = new ClassBreaksRenderer({
    field: "Population",

    classBreakInfos: [
      {
        minValue: 0,
        maxValue: 2500,
        symbol: {
          type: "simple-fill",
          color: "#d4f0c0", // light green
          outline: { color: "#000000", width: 0.5 },
        },
        label: "fewer than 2,500",
      },
      {
        minValue: 2501,
        maxValue: 5000,
        symbol: {
          type: "simple-fill",
          color: "#a1d99b", // medium green
          outline: { color: "#000000", width: 0.5 },
        },
        label: "2,500 - 5,000",
      },
      {
        minValue: 5001,
        maxValue: 10000,
        symbol: {
          type: "simple-fill",
          color: "#74c476", // darker green
          outline: { color: "#000000", width: 0.5 },
        },
        label: "5,000 - 10,000",
      },
      {
        minValue: 10001,
        maxValue: 20000,
        symbol: {
          type: "simple-fill",
          color: "#31a354",
          outline: { color: "#000000", width: 0.5 },
        },
        label: "10,000 - 20,000",
      },
      {
        minValue: 20001,
        maxValue: 30000,
        symbol: {
          type: "simple-fill",
          color: "#006d2c",
          outline: { color: "#000000", width: 0.5 },
        },
        label: "20,000 - 30,000",
      },
      {
        minValue: 30001,
        maxValue: 40000,
        symbol: {
          type: "simple-fill",
          color: "#00441b",
          outline: { color: "#000000", width: 0.5 },
        },
        label: "30,000 - 40,000",
      },
      {
        minValue: 40001,
        maxValue: 50000,
        symbol: {
          type: "simple-fill",
          color: "#002611",
          outline: { color: "#000000", width: 0.5 },
        },
        label: "more than 40,000",
      },
    ],
  });

  // Popup
  const popUpContent = {
    title: "Brgy. {ADM4_EN}",
    content:
      "Population: {pop_Popula} <br> Area (sqkm): {AREA_SQKM} <br>" +
      '<img src="{img_url}" alt="location image" style="width:200px; height:200px;">',
    fieldInfos: [
      {
        fieldName: "AREA_SQKM",
        format: {
          places: 2,
          digitSeparator: true,
        },
      },
    ],
  };

  //Data
  const layer = new GeoJSONLayer({
    popupTemplate: popUpContent,
    url: "tagum_population.geojson",
    renderer: populationRenderer,
    opacity: 0.7,
  });

  //Base Map
  const map = new Map({
    basemap: "gray",
    layers: [layer],
  });

  const view = new MapView({
    container: "myMap",
    map: map,
    center: [125.810692, 7.401924],
    zoom: 11,
  });

  // Create the legend widget
  const legend = new Legend({
    view: view,
    layerInfos: [
      {
        layer: layer,
        title: "Legend",
      },
    ],
  });

  view.ui.add(legend, "bottom-right");
  view.ui.move("zoom", "top-right");

  cityZoom();

  const homeWidget = new Home({
    view: view,
  });

  view.ui.add(homeWidget, "top-right");

  /////////////// interactive functions /////////////////
  function cityZoom() {
    layer.when(() => {
      view.goTo(layer.fullExtent);
    });
  }

  // Populate Empty Select List
  let barangayList = [];
  selectOptions = "";
  let selectElement = document.getElementById("selectList");

  const queryBarangayList = new Query();
  queryBarangayList.outSpatialReference = { wkid: 102100 };
  queryBarangayList.returnGeometry = false;
  queryBarangayList.outFields = ["*"];

  layer.queryFeatures(queryBarangayList).then(function (results) {
    let featureSet = results.features;

    for (let i = 0; i < featureSet.length; i++) {
      let barangays = featureSet[i].attributes.ADM4_EN;
      barangayList.push(barangays);
    }

    barangayList.forEach((item) => {
      selectOptions += `<option value="${item}">${item}</option>`;
    });

    selectElement.innerHTML = selectOptions;
  });

  // Barangay Finder
  function findPlace() {
    document
      .getElementById("queryButton")
      .addEventListener("click", function () {
        let selectedItem = document.getElementById("selectList").value;
        console.log("Query Click " + selectedItem);

        const selectedPlace = new Query();
        selectedPlace.outSpatialReference = { wkid: 102100 };
        selectedPlace.returnGeometry = true;
        selectedPlace.where = `ADM4_EN = '${selectedItem}'`;
        selectedPlace.outFields = ["*"];

        layer.queryFeatures(selectedPlace).then(function (results) {
          let selectItem = results.features[0].attributes;
          let selectedGeometry = results.features[0].geometry;
          view.goTo(selectedGeometry);

          let queryItem = document.getElementById("queryItem");
          queryItem.style.display = "block";

          queryItemDiv = document.getElementById("queryItem");
          queryItem = `<br> <h3>Barangay ${selectItem.ADM4_EN}</h3>
          <p>It has a population of ${selectItem.pop_Popula} 
          with an area of ${selectItem.AREA_SQKM.toFixed(2)} sqkm </p> 
          <br> <img src="${selectItem.img_url}" 
          style="height:300px; width:400px;" />`;

          queryItemDiv.innerHTML = queryItem;

          let clearButton = document.getElementById("clearButton");
          clearButton.style.display = "block";
        });

        let informationStyle = document.getElementById("informationTab");
        informationStyle.style.top = "28%";
      });
  }

  document.getElementById("clearButton").addEventListener("click", function () {
    let informationStyle = document.getElementById("informationTab");
    informationStyle.style.top = "78%";

    let clearButton = document.getElementById("clearButton");
    clearButton.style.display = "none";

    let queryItem = document.getElementById("queryItem");
    queryItem.style.display = "none";

    cityZoom();
  });

  findPlace();
});
