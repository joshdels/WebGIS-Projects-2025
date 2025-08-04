require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/symbols/PictureMarkerSymbol",
  "esri/PopupTemplate",
  "esri/widgets/Legend",
  "esri/widgets/LayerList",
  "esri/layers/support/LabelClass",
  "esri/rest/support/Query",
  "esri/widgets/Expand",
  "esri/Graphic",
  "esri/widgets/Sketch",
  "esri/layers/GraphicsLayer",
  "esri/geometry/operators/intersectionOperator",
  "esri/widgets/Bookmarks",
  "esri/widgets/Print",
  "esri/widgets/BasemapLayerList",
  "esri/rest/support/StatisticDefinition",
], function (
  esriConfig,
  Map,
  MapView,
  FeatureLayer,
  PictureMarkerSymbol,
  PopupTemplate,
  Legend,
  LayerList,
  LabelClass,
  Query,
  Expand,
  Graphic,
  Sketch,
  GraphicsLayer,
  intersectionOperator,
  Bookmarks,
  Print,
  BasemapLayerList,
  StatisticDefinition
) {
  //API
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurFqQ61x9cGnw88FPfWt2DoxASckmLACOn-AUhGMilYabU8I9Y3E6Y1KV9s9QyuykiSZvXowrXyyu0zrO_IhKbpMNXAvvxvNeeidKfdfBa5M6umAjryN60lyjygMpUmUgMb7CX-C34h0yOCtEKNZEjrKOPg24jZIi4ry7j64UR8errlHCIMwjXOhLyQpxUELOO229hcCFvy9oKSpMDVGBuhk.AT1_UhnG8Nri";

  // BaseMap
  const map = new Map({
    basemap: "arcgis/streets-relief",
  });

  const graphicsLayer = new GraphicsLayer({
    title: "Graphics",
    listMode: "hide",
  });

  // Renderer
  let trailheadsSymbol = new PictureMarkerSymbol({
    url: "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
    width: "18px",
    height: "18px",
  });

  const trailheadsRenderer = {
    type: "simple",
    symbol: trailheadsSymbol,
  };

  const trailLinesRenderer = {
    type: "simple",
    symbol: {
      type: "simple-line",
      width: "2px",
      color: "red",
      outline: {
        width: 1,
        color: "white",
      },
    },
  };

  const parksRenderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: "skyblue",
      outline: {
        width: "1px",
        color: "black",
      },
    },
  };

  //// POP OUT
  let trailheadsPT = new PopupTemplate({
    title: "The name of trail: {TRL_NAME}",
    content:
      "The Trail head is in the park {PARK_NAME} <br>"
  });

  let trailLinesPT = new PopupTemplate({
    title: "The name of trail: {TRL_NAME}",
    content: "Elevation Gain: {ELEV_MAX}",
  });

  let parksPT = new PopupTemplate({
    title: "The name of Park: {PARK_NAME }",
    content: "Acres: {GIS_ACRES}",
  });

  //// DATA
  // trailheads
  const trailheadsLayer = new FeatureLayer({
    popupTemplate: trailheadsPT,
    renderer: trailheadsRenderer,
    title: "Trail Heads",
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
  });

  // trailheads
  const trailLinesLayer = new FeatureLayer({
    popupTemplate: trailLinesPT,
    renderer: trailLinesRenderer,
    title: "Trail Lines",
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0",
  });

  // Parks
  const parksLayer = new FeatureLayer({
    popupTemplate: parksPT,
    renderer: parksRenderer,
    title: "Parks and Openspace",
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0",
  });

  map.add(parksLayer);
  map.add(trailLinesLayer);
  map.add(trailheadsLayer);
  map.add(graphicsLayer);

  //View
  const view = new MapView({
    container: "myView",
    map: map,
    center: [-118.80543, 34.027],
    zoom: 13,
    padding: {
      left: 49,
    },
  });

  //Labels
  const trailName = new LabelClass({
    labelExpressionInfo: { expression: "$feature.TRL_NAME" },
    symbol: {
      type: "text",
      color: "black",
      haloSize: 1,
      haloColor: "white",
    },
  });

  trailheadsLayer.labelingInfo = [trailName];

  //// Event Listener
  document.getElementById("queryButton").addEventListener("click", function () {
    let currentWhere = document.getElementById("whereClause").value;
    queryFeatureLayer(currentWhere);
    queryFeatureLayerCount(currentWhere);
    
    //height adjuster of the query
    let myViewElement = document.getElementById("myView");
    let tableElement = document.getElementById("featureTablePH");
    let chartElement = document.getElementById("viewChartContainer");
    myViewElement.style.height = "70%";
    tableElement.style.height = "30%";
    tableElement.style.display = "block";
    chartElement.style.display = "block";


    view.ui.add(chartExpand, "top-right");
  });

  //Clear button
  document.getElementById("clearButton").addEventListener("click", function () {
    let myViewElement = document.getElementById("myView");
    let tableElement = document.getElementById("featureTablePH");
    let chartElement = document.getElementById("viewChartContainer");
    myViewElement.style.height = "100%";
    tableElement.style.display = "none";
    chartElement.style.display = "none";

    view.graphics.removeAll();
    view.ui.remove(chartExpand);
  });

  // Query Section
  function queryFeatureLayerCount(whereClause) {
    const query = new Query();
    query.where = whereClause;
    query.outSpatialReference = { wkid: 102100 };
    query.outFields = ["*"];

    let statisticDefinition = new StatisticDefinition({
      statisticType: "count",
      onStatisticField: "AGNCY_TYP",
      outStatisticFieldName: "AGNCY_TYP_COUNT",
    });

    query.outStatistics = [statisticDefinition];
    query.groupByFieldsForStatistics = ["AGNCY_TYP"];

    parksLayer.queryFeatures(query).then(function (response) {
      let xValues = [];
      let yValues = [];

      for (let i = 0; i < response.features.length; i++) {
        let cf = response.features[i];
        xValues.push(cf.attributes["AGNCY_TYP"]);
        yValues.push(cf.attributes["AGNCY_TYP_COUNT"]);
      }

      const chart = document.getElementById("viewChart");

      new Chart(chart, {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [
            {
              label: "Agency Type",
              backgroundColor: [
                "Red",
                "Blue",
                "Yellow",
                "Green",
                "Purple",
                "Orange",
                "Violet",
                "Pink",
                "Gray",
              ],
              data: yValues,
            },
          ],
        },
        options: {
          legend: { display: false },
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Agency Type",
          },
        },
      });
    });
  }
  const chartExpand = new Expand({
    expandIcon: "graph-bar",
    view: view,
    content: document.getElementById("viewChartContainer"),
  });

  function queryFeatureLayer(whereClause) {
    const query = new Query();
    query.where = whereClause;
    query.outSpatialReference = { wkid: 102100 };
    query.returnGeometry = true;
    query.outFields = ["*"];

    parksLayer.queryFeatures(query).then(function (results) {
      let featureSet = results.features;
      createTable(featureSet);

      // add highlights
      for (let i = 0; i < featureSet.length; i++) {
        let polygonHighligh = new Graphic({
          geometry: featureSet[i].geometry,
          symbol: {
            type: "simple-fill",
            color: "green",
            style: "solid",
            outline: {
              color: "black",
              width: 0.5,
            },
          },
        });
        view.graphics.add(polygonHighligh);
      }
    });
  }

  function createTable(featureSet) {
    let featureTablePH = document.getElementById("featureTablePH");

    // heads and row components
    let headerRow = "";
    let attributesRow = "";

    for (let i = 0; i < featureSet.length; i++) {
      if (i === 0) {
        const headers = Object.keys(featureSet[0].attributes);
        headers.forEach((header) => {
          headerRow += "<th>" + header + "</th>";
        });
      }

      let rowContent = "";
      const rows = Object.values(featureSet[i].attributes);
      rows.forEach((row) => {
        rowContent += "<td>" + row + "</td>";
      });
      attributesRow += "<tr>" + rowContent + "</tr>";
    }

    // Creation of table
    let table =
      "<table><tr>" + headerRow + "</tr>" + attributesRow + "</table>";
    featureTablePH.innerHTML = table;
  }

  //Widgets
  // Legend
  let legend = new Legend({
    view: view,
    container: "legend-container",
  });

  // Widget
  let layerList = new LayerList({
    view: view,
    container: "layer-container",
  });

  let basemapList = new BasemapLayerList({
    view: view,
    container: "basemap-container",
    visibilityAppearance: "checkbox",
  });

  const bookmarks = new Bookmarks({
    view,
    container: "bookmarks-container",
    visibleElements: { thumbnail: true },

    bookmarks: [
      {
        name: "test",
        viewpoint: {
          targetGeometry: {
            type: "extent",
            xmin: -13139131.948889678,
            ymin: 4047767.23531948,
            xmax: -13092887.54677721,
            ymax: 4090610.189673263,
            spatialReference: {
              wkid: 102100,
            },
          },
        },
        thumbnail: {
          sourceURL:
            "https://cdn05.zipify.com/RQZYw7dLmDEk4o6MjUoZpEqKAbE=/fit-in/3840x0/3ce46b1ccb124af29d7bc3744f975d5b/pot013-dec-blogs-61.jpeg",
        },
      },
    ],
  });
  const print = new Print({
    view,
    container: "print-container",
  });

  //////// for calcite Practice
  const myView = document.getElementById("myView");

  view.when(() => {
    // const { title, description, thumbnailUrl, avgRating } =myView.map.portalItem;
    document.querySelector("#header-title").heading =
      "My Best Practice Web GIS";
    document.querySelector("#item-description").innerHTML =
      "This is my 6/21/2025 practice of webMaps";
    document.querySelector("#item-thumbnail").src = map.basemap.thumbnailUrl;
    document.querySelector("#item-rating").value = 4.77;

    myView.view.padding = {
      left: 49,
    };
  });

  let activeWidget;

  const handleActionBarClick = ({ target }) => {
    if (target.tagName !== "CALCITE-ACTION") {
      return;
    }

    if (activeWidget) {
      document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
      document.querySelector(`[data-panel-id=${activeWidget}]`).closed = true;
    }

    const nextWidget = target.dataset.actionId;
    if (nextWidget !== activeWidget) {
      document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
      document.querySelector(`[data-panel-id=${nextWidget}]`).closed = false;
      activeWidget = nextWidget;
      document.querySelector(`[data-panel-id=${nextWidget}]`).setFocus();
    } else {
      activeWidget = null;
    }
  };

  document
    .querySelector("calcite-action-bar")
    .addEventListener("click", handleActionBarClick);

  /////////////////////////////

  let actionBarExpanded = false;

  document.addEventListener("calciteActionBarToggle", (event) => {
    actionBarExpanded = !actionBarExpanded;
    view.padding = {
      left: actionBarExpanded ? 135 : 49,
    };
  });

  document.querySelector("calcite-shell").hidden = false;
  document.querySelector("calcite-loader").hidden = true;

  // Panel interaction
  const panelEls = document.querySelectorAll("calcite-panel");
  for (let i = 0; i < panelEls.length; i++) {
    panelEls[i].addEventListener("calcitePanelClose", () => {
      document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
      document.querySelector(`[data-action-id=${activeWidget}]`).setFocus();
      activeWidget = null;
    });
  }

  //ganna review and revise this one
  function zoomToTableGeometry() {
    let table = document.getElementById("featureTablePH");

    table.addEventListener("click", function (event) {
      const row = event.target.closest("tr");
      let index = parseInt(row.cells[0].textContent);

      if (row) {
        const query = new Query();
        query.where = `FID = ${index}`;
        query.outSpatialReference = { wkid: 102100 };
        query.returnGeometry = true;
        query.outFields = ["*"];

        parksLayer.queryFeatures(query).then(function (results) {
          let featureSet = results.features;
          target = featureSet[0].geometry.extent;
          view.goTo(target);
        });
      }
    });
  }

  zoomToTableGeometry();

  ///// SKETCH SECTION
  // Find all queried parks in a custom drawn geometry  - DONE
  // Queried polygons
  // 1. sketch widget (with just the option to draw polygons) - done
  // 2. When user draws a polygon and finishes
  // 3. When Check which parks are inside that polygon (let geometry arrays = []) are inside the polygon
  // 4. Create a list with that parks

  let sketch = new Sketch({
    view: view,
    container: "spatial-analysis-container",
    layer: graphicsLayer,
    snappingOptions: {
      enabled: true,
      featureSources: [
        {
          layer: graphicsLayer,
        },
      ],
    },
    visibleElements: {
      createTools: {
        point: false,
        circle: false,
        polyline: false,
      },
      selectionTools: {
        "rectangle-selection": false,
        "lasso-selection": false,
      },
      undoRedoMenu: false,
      settingsMenu: false,
    },
  });

  // Listen to sketch widget's create event.
  sketch.on("create", function (event) {
    if (event.state === "start") {
      graphicsLayer.removeAll();
    }
    if (event.state === "complete") {
      let drawGeometry = event.graphic.geometry;
      let intersectingParks = [];
      // query it
      const query = parksLayer.createQuery();
      query.returnGeometry = true;
      query.outFields = ["*"];

      parksLayer.queryFeatures(query).then(function (results) {
        let queriedParks = results.features;

        for (let i = 0; i < queriedParks.length; i++) {
          const contains = intersectionOperator.execute(
            drawGeometry,
            queriedParks[i].geometry
          );
          if (contains) {
            intersectingParks.push(queriedParks[i].attributes["PARK_NAME"]);
          }
        }

        console.log(intersectingParks);
      });
    }
  });

  // view.ui.add(sketch, "top-right");
});
