// Store our API endpoint inside queryUrl
var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=" +
  "2019-01-18&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    
  });
  
function getColor(d) {
 // if 4.00 <= d >= 3.50 
    return   d > 4.00  ?  'crimson':
             d > 3.50  ? 'red' :
             d > 3.00  ? 'fuchsia' :
             d > 2.50  ? 'deeppink' :
             d > 2.00 ? 'orangered' :
             d > 1.50   ? 'orange' :
             d > 1.00 ? 'yellow' :
             d > 0  ? 'green' :  
                 'lightgreen'; 
      
                       
} 
    
function getRadius(d) {
  return d *5
}

function MarkerOptions (feature) {
    return {
    radius: 1 + getRadius(feature.properties.mag),
    fillColor: getColor(feature.properties.mag),
    color: getColor(feature.properties.mag),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.6
}
}

//L.geoJson(feature, {
   

  function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function popUp(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "<br>"+ "Magnitude: " + feature.properties.mag +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
        //layer.toGeoJSON(myIcon)
        
    };
    
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: popUp,
      pointToLayer: function (_earthquakeData, latlng) {

        return L.circleMarker(latlng, MarkerOptions(_earthquakeData))
    }
});
//).addTo(map);

    
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  

        // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
     


//add legend
var legend = L.control({position: "bottomright" });
legend.onAdd = function () {
var div = L.DomUtil.create('div', 'info legend');
var labels = ['<strong>Richter Scale Indicators</strong>'];
var categories = ['0-1.0','1-1.5','1.5-2','2-2.5','2.5-3','3-3.5','4-4+'];

for (var i = 0; i < categories.length; i++) {
    div.innerHTML += 
    labels.push(
       '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
        (categories[i] ? categories[i] : '+'));

    }
  div.innerHTML = labels.join('<br>');
return div;
};



// Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: true
}).addTo(myMap);
legend.addTo(myMap);
}

    