// I wrote my code in index.html. This is a copy of it.


<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>USGS Earthquake Visualization</title>

    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />

    <style>

        #map {

            height: 600px;

        }

    </style>

</head>

<body>



<div id="map"></div>



<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>



<script>

    // Function to get earthquake data

    function getEarthquakeData() {

        $.ajax({

            url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',

            success: function (data) {

                visualizeData(data.features);

            }

        });

    }



    // Function to create the map and visualize the earthquake data

    function visualizeData(earthquakeData) {

        var map = L.map('map').setView([0, 0], 2);



        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

            attribution: '© OpenStreetMap contributors'

        }).addTo(map);



        // Define a function to set marker style based on magnitude and depth

        function getMarkerStyle(magnitude, depth) {

            return {

                radius: magnitude * 3,

                fillColor: getColor(depth),

                color: '#000',

                weight: 1,

                opacity: 1,

                fillOpacity: 0.8

            };

        }



        // Define a function to get color based on depth

        function getColor(depth) {

            var colors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'];

            return depth > 300 ? colors[4] :

                depth > 100 ? colors[3] :

                    depth > 70 ? colors[2] :

                        depth > 30 ? colors[1] :

                            colors[0];

        }



        // Loop through earthquake data and add markers to the map

        earthquakeData.forEach(function (quake) {

            var coordinates = quake.geometry.coordinates;

            var magnitude = quake.properties.mag;

            var depth = coordinates[2];

            var marker = L.circleMarker([coordinates[1], coordinates[0]], getMarkerStyle(magnitude, depth)).addTo(map);



            // Add popup with additional information

            marker.bindPopup(`<b>Location:</b> ${quake.properties.place}<br/><b>Magnitude:</b> ${magnitude}<br/><b>Depth:</b> ${depth} km`);

        });



        // Create a legend

        var legend = L.control({ position: 'bottomright' });



        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend');

            var depths = [0, 30, 70, 100, 300];

            var labels = [];



            for (var i = 0; i < depths.length; i++) {

                div.innerHTML += `<i style="background:${getColor(depths[i] + 1)}"></i>${depths[i]}${(depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+')}`

            }



            return div;

        };



        legend.addTo(map);

    }



    // Call the function to get earthquake data and visualize it

    getEarthquakeData();

</script>



</body>

</html>