// Creating the map object
var myMap = L.map("map", {
    center: [40.036217, -75.513809],
    zoom: 4,
    trackResize: true
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Load the GeoJSON data.
  var geoEarthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Getting our GeoJSON data 
  d3.json(geoEarthquakeDataURL).then(function (data) {
  
    let earthquakeData = data.features;
  
    //call function createMapFeatures passing the earthquakeData
    createMapFeatures(earthquakeData);
  });
  
  //----------------------------------------------------------------------------------------------------
  // createMapFeatures() - create the map features using the earthquakeData
  //----------------------------------------------------------------------------------------------------
  function createMapFeatures(earthquakeData) {
  
    //--------------------------------------------------------------------------------------------------
    // create layer group for earthquake data
    //--------------------------------------------------------------------------------------------------
    L.geoJson(earthquakeData, {
      pointToLayer: set_pointToLayer_attributes,
      onEachFeature: set_onEachFeature_attributes     // This is called on each feature
    }).addTo(myMap);
  
    //--------------------------------------------------------------------------------------------------
    // set_pointToLayer_attributes() - set the attributes for each layer 
    //--------------------------------------------------------------------------------------------------
    function set_pointToLayer_attributes(feature, latlng) {
      let radius = (feature.properties.mag) * 4;
      let depth = feature.geometry.coordinates[2];
      let color = setMarkerColor(depth);
  
      let markerAttributes = {
        radius: radius,
        fillColor: color,
        color: "darkgreen",
        weight: .75,
        opacity: 2,
        fillOpacity: 1
      }
      return L.circleMarker(latlng, markerAttributes);
    };
  
    //--------------------------------------------------------------------------------------------------
    // setMarkerColor() - set the marker color based on earthquake depth
    //--------------------------------------------------------------------------------------------------
    function setMarkerColor(depth) {
      switch (true) {
        case (depth <= 10):
          return "#ffffb2";
        case (depth <= 30):
          return "#fed976";
        case (depth <= 50):
          return "#feb24c";
        case (depth <= 70):
          return "#fd8d3c";
        case (depth <= 90):
          return "#fc4e2a";
        default:
          return "#e31a1c";
      }
    };
  
    //--------------------------------------------------------------------------------------------------
    // set_onEachFeature_attributes() - set the attributes for each feature
    //--------------------------------------------------------------------------------------------------
    function set_onEachFeature_attributes(feature, layer) {
      // Giving each feature a popup with information that's relevant to it
      layer.bindPopup("<p>Magnitude: " + feature.properties.mag + "<br>" +
        "Location : " + feature.properties.place + "<br>" +
        "Depth    : " + feature.geometry.coordinates[2] + "<br></p>");
    };
  
    //--------------------------------------------------------------------------------------------------
    // Add legend to the map
    //--------------------------------------------------------------------------------------------------
    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function (myMap) {
      let div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];
  
      labels.push("<h7>Depths</h7><br>");
      for (let i = 0; i < depths.length; i++) {
        labels.push(
          '<li style="background:' + setMarkerColor(depths[i] + 1) + '">' +
          depths[i] + (depths[i + 1] ? '-' + depths[i + 1] + '<br>' : '+') + '</li>');
      }
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(myMap);
  
  };
  
