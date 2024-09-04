// URL for the earthquake data
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// URL for the tectonic plates GeoJSON data
let tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";


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
d3.json(queryUrl).then(function (earthquakeData) {
   console.log(earthquakeData);

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
   let earthquakes = L.geoJson(earthquakeData, {
    pointToLayer: function(feature,latlng) {
        return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
   }).addTo(myMap);

   d3.json(tectonicPlatesUrl).then(function(tectonicData) {
      // Create the tectonic plates layer
      let tectonicPlates = L.geoJSON(tectonicData, {
          style: function(feature) {
          return {
                color: "#FEFF33", 
                weight: 2,       
                fillOpacity: 0    
         }
       }
      }).addTo(myMap);

      createMap(earthquakes, tectonicPlates);
    });
  });


function createMap(earthquakes,tectonicPlates) {
  // Create the tile layer that will be the background of my map.
      let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
    
      let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  // Create a baseMaps object to hold the streetmap layer.
      let baseMaps = {
         "Street Map": streetmap,
         "Topographic Map": topo
    };
  // Create an overlay object to hold our overlay.
      let overlayMaps = {
         "Tectonic Plates": tectonicPlates,
         "Earthquakes": earthquakes
      };
  // Add layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
 }).addTo(myMap)};


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



