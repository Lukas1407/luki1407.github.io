var x = document.getElementById("initPos");
var y = document.getElementById("myPos");
// init location
var initLat = 0;
var initLng = 0;
// default location
var myLat = 40;
var myLng = -73;

// default ny location
var nyLat = 40.730610;
var nyLng = -73.935242;

/**Check in a perimeter of 50 meters for valid pano**/ 
var checkaround = 500;

    function getLocation() {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setInitPosition, showError, options);
        } else { 
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function setInitPosition(position) {
        initLat = position.coords.latitude;
        initLng = position.coords.longitude;
        x.innerHTML = "Initial Latitude: " + initLat + 
        "<br> initaial Longitude: " + initLng;
        document.getElementById("btn_update").style.visibility="visible"
    }

    function updatePosition() {
        navigator.geolocation.getCurrentPosition(setPosition);
    }

    function setPosition(position) {
        myLat = position.coords.latitude;
        myLng = position.coords.longitude;
        y.innerHTML = "Updated Langitude: " + myLat + 
        "<br> updated Longitude: " + myLng;

        // update pano
        var latDif = initLat - myLat;
        var lngDif = initLng - myLng;

        var position = {lat: nyLat+latDif, lng: nyLng+lngDif};
        sv = new google.maps.StreetViewService();
        sv.getPanorama({ location: position, radius: checkaround }).then(processSVData);
        panorama = new google.maps.StreetViewPanorama(
            document.getElementById("pano"), {
                motionTracking: true,
                motionTrackingControl: true,
                streetViewControl: false,
            }
        );
        map = new google.maps.Map(document.getElementById("map"), {
            center: position,
            zoom: 16,
            streetViewControl: false,
        });
        panorama.setMotionTracking(true);
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                x.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "An unknown error occurred."
                break;
        }
    }

    /*
    * Click the map to set a new location for the Street View camera.
    */
    let map;
    let panorama;

    function initialize() {
        const position = { lat: nyLat, lng: nyLng };
        const sv = new google.maps.StreetViewService();

        panorama = new google.maps.StreetViewPanorama(
            document.getElementById("pano"), {
                // endable motion tracking
                motionTracking: true,
                motionTrackingControl: true,
            }
        );
        // Set up the map.
        map = new google.maps.Map(document.getElementById("map"), {
            center: position,
            zoom: 16,
            streetViewControl: false,
        });
        // Set the initial Street View camera to the center of the map
        sv.getPanorama({ location: position, radius: checkaround }).then(processSVData);
        // Look for a nearby Street View panorama when the map is clicked.
        // getPanorama will return the nearest pano when the given
        // radius is 50 meters or less.
        map.addListener("click", (event) => {
            sv.getPanorama({ location: event.latLng, radius: checkaround })
            .then(processSVData)
            .catch((e) =>
                // no valid street view was found
                console.error("Street View data not found for this location.")
            );
        });
        panorama.setMotionTracking(true);
    }

    function processSVData({ data }) {
        const location = data.location;
        const marker = new google.maps.Marker({
            position: location.latLng,
            map,
            title: location.description,
        });

        panorama.setPano(location.pano);
        panorama.setPov({
            heading: 270,
            pitch: 0,
        });
        panorama.setVisible(true);
        marker.addListener("click", () => {
            const markerPanoID = location.pano;

            // Set the Pano to use the passed panoID.
            panorama.setPano(markerPanoID);
            panorama.setPov({
                heading: 270,
                pitch: 0,
            });
        panorama.setVisible(true);
        });
    }

    function getNewPano() {
        getLocation();
        const position = { lat: nyLat, lng: nyLng };
        sv.getPanorama({ location: position, radius: checkaround }).then(processSVData);
    }
