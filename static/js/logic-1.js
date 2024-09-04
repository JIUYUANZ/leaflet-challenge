// URL for the earthquake data
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create our initial map object.
let myMap = L.map("map", {
    center: [0, 85],
    zoom: 3,
 });

// Use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function getColor(depth) {
    if (depth > 90) {
      color = "#062A77";
  }
    else if (depth > 70) {
      color = "#343F66";
  }
    else if (depth > 50) {
      color = "#625355";
  }
    else if (depth >30) {
      color = "#916844";
  }
    else if (depth >10) {
      color = "#BF7C33";
  }
    else {
      color = "#ED9122";
  }
  return color;
  }

// Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if(magnitude === 0) {
        return 1
    }
    return Math.pow(magnitude,2) * 1
}

//Grab data with d3
d3.json(queryUrl).then(function (data) {
   console.log(data);

  // This function returns the style data for each of the earthquakes we plot on the map. 
  // We pass the magnitude and depth of the earthquake to calculate the color and radius.
   function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "black",
      radius: getRadius(feature.properties.mag),
      weight: 1
    }
  }
  L.geoJson(data, {
    pointToLayer: function(feature,latlng) {
        return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
   }).addTo(myMap);


  //add legend on Bottom Right Corner
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {
    //Dom Utility that puts legend into DIV & Info Legend
      var div = L.DomUtil.create('div', 'info legend'),
      //depths, stops at 5 level
          depths = [-10, 10, 30, 50, 70, 90];
          div.style.backgroundColor = 'rgba(255, 255, 255, 1)';
          div.style.padding = '10px';
          colors = [ "#ED9122","#BF7C33","#916844","#625355","#343F66","#062A77"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        //HTML code with nbs(non-breaking space) and ndash
        '<i style="background:' + getColor(depths[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
  };
  //Adds Legend to myMap
  legend.addTo(myMap);

});