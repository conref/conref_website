patata = 'pk.eyJ1IjoiY2F0YnJ1IiwiYSI6ImNseTZkem80MDA4b3kyc3NhNWEzczYyemQifQ.FxBSDm2Q4GRASXYAIoo8nw';
mapboxgl.accessToken = patata;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    zoom: 2, // starting zoom
    center: [25, 45] // // starting center in [lng, lat]
});

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

map.on('load', () => {
    map.loadImage(
        './marker.png',
        (error, image) => {
            if (error) throw error;

            // Add the image to the map style.
            map.addImage('ballotbox', image);

            // Add a data source containing one point feature.
            map.addSource('referendums', {
                type: 'geojson',
                // Use a URL for the value for the `data` property.
                data: 'locations_with_popup.geojson'
            });

            // Add a layer to use the image to represent the data.
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'referendums', // reference the data source
                'layout': {
                    'icon-image': 'ballotbox', // reference the image
                    'icon-size': 1
                }
            });

            // When a click event occurs on a feature in the places layer, open a popup at the
            // location of the feature, with description HTML from its properties.
            map.on('click', 'points', (e) => {
                // Copy coordinates array.
                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.popups;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                if (['mercator', 'equirectangular'].includes(map.getProjection().name)) {
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'points', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'points', () => {
                map.getCanvas().style.cursor = '';
            });
        }
    );

});