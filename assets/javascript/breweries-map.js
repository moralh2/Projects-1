var geoBrews = []
var map
var markers = []

var config = {
    apiKey: "AIzaSyCACl0dIADoUYtr0cU0l6WsUMGbcHhC3Vo",
    authDomain: "project1-388e6.firebaseapp.com",
    databaseURL: "https://project1-388e6.firebaseio.com",
    projectId: "project1-388e6",
    storageBucket: "project1-388e6.appspot.com",
    messagingSenderId: "62443097997"
};

localStorage.clear();

firebase.initializeApp(config);
var database = firebase.database();

database.ref('/breweriesJSON').on("value", function (snapshot) {
    var results = snapshot.val()
    breweriesATX = results
    for (var i = 0; i < results.length; i++) {
        if (typeof results[i] == "undefined") {
            console.log('skipped')
        }
        else {
            geoBrews[i] = {
                breweryID: results[i].breweryID,
                name: results[i].name,
                location: results[i].location
            }
        }
    }
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


function initialize() {
    var coordn = { lat: 30.2603535, lng: -97.7145152 };
    map = new google.maps.Map(document.getElementById('map-breweries'), { center: coordn, zoom: 10 });


    youAreHereInfoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation. (User location)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            youAreHereInfoWindow.setPosition(pos);
            youAreHereInfoWindow.setContent('You Are Here!');/////info little
            youAreHereInfoWindow.open(map);
            map.setCenter(pos);
            addAllMarkers()
        }, function () {
            handleLocationError(true, youAreHereInfoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, youAreHereInfoWindow, map.getCenter());
    }
}

// Add Marker
function addMarker(index, location, map, title) {
    var stringForIcon = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue" + index + ".png"
    var breweryInfoWindow = new google.maps.InfoWindow({ content: title });

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: title,
        icon: stringForIcon,
        infowindow: breweryInfoWindow
    });

    markers.push(marker)

    google.maps.event.addListener(marker, 'click', function () {
        hideAllInfoWindows(map);
        this.infowindow.open(map, this);
    });
}

// Hide all info windows when another is clicked
function hideAllInfoWindows(map) {
    markers.forEach(function (marker) {
        marker.infowindow.close(map, marker);
    });
}



// Handle error loading geolocation
function handleLocationError(browserHasGeolocation, youAreHereInfoWindow, pos) {
    youAreHereInfoWindow.setPosition(pos);
    youAreHereInfoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    youAreHereInfoWindow.open(map);
}

jQuery(function ($) {
    // Asynchronously Load the map API 
    var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq8qjNnAwkr_fPwdDQGd7CR_qYMMTWYjY&callback=initialize";
    document.body.appendChild(script);
});

function addAllMarkers() {
    var name
    for (i = 0; i < geoBrews.length; i++) {
        if (Array.isArray(geoBrews[i].name)) {
            name = geoBrews[i].name[0]
        }
        else {
            name = geoBrews[i].name
        }
        console.log(i + 1, geoBrews[i].location, map, name)
        addMarker(i + 1, geoBrews[i].location, map, name);
    }
}