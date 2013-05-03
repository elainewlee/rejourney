
// $("#home_clearstorage_button").on('click', function(){
//  window.localStorage.clear();
// });

// $("#home_seedgps_button").on('click', function(){
//  window.localStorage.setItem('Sample block', '[{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700803000,"coords":{"heading":null,"altitude":null,"longitude":170.33481666666665,"accuracy":0,"latitude":-45.87465,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700804000,"coords":{"heading":null,"altitude":null,"longitude":170.33426999999998,"accuracy":0,"latitude":-45.873708333333326,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,"coords":{"heading":null,"altitude":null,"longitude":170.33318333333335,"accuracy":0,"latitude":-45.87178333333333,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700806000,"coords":{"heading":null,"altitude":null,"longitude":170.33416166666666,"accuracy":0,"latitude":-45.871478333333336,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,"coords":{"heading":null,"altitude":null,"longitude":170.33526833333332,"accuracy":0,"latitude":-45.873394999999995,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{"heading":null,"altitude":null,"longitude":170.33427333333336,"accuracy":0,"latitude":-45.873711666666665,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700809000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}}]');

// });
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************

// var watch_id = null;    // ID of the geolocation
// var photoLocation_id = null; //ID of location the ohto was taken
var journeyTracking_data = []; // Array containing GPS position objects for journey
var photoTracking_data = []; // Array containing GPS position objects for journey
var journeyTime_val = []; // Array containing time for journey
var photoTime_val = []; // Array containing time for journey
var map = null;
// var photoTallyForJourney = null; // Variable counting the number of photos taken on the journey.
// var db = null;


//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************

function onStartJourneySuccess(position) { //Position object created by the geolocation API: coords + timestamp
    alert("onStartJourneySuccess");
    var myLat = position.coords.latitude;
    var myLong = position.coords.longitude;
    var startTime = position.timestamp;
    var myLatLng = new google.maps.LatLng(myLat, myLong);
    map.setCenter(myLatLng);
    journeyTracking_data.push(myLatLng);
    journeyTime_val.push(startTime);
    last_values = [myLat, myLong];
    myCoords.push(last_values);

    var trackPath = new google.maps.Polyline({
        path: tracking_data,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2

    });
    trackPath.setMap(map);
    //Write to db using model.js functions.
    addTrackPointToDB(journey_id, position) //Write geolocation to db. See model.js

}

function onStartError(error) {
    alert("onStartError: " + "error.message: " + error.message);
}

$("#startJourney").on('click', function(){
    // alert('startJourney clicked');
    var journeyName = $('#journeyName').val(); //from #journeyName_field" of home page
    addJourneyToDB(journeyName, Date.now()); //Write journey name to db when start journey button is clicked. See model.js
    var default_center = new google.maps.LatLng(37.37, 121.92);
    var mapOptions = {
        zoom: 15,
        center: default_center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    alert('Map object:' + map);
    alert('Journey: "' + journeyName + '" started!');
    var watch_id = null;    // ID of the geolocation
    watchId = navigator.geolocation.watchPosition(onStartJourneySuccess, onStartError, { // Start tracking
        maximumAge: 1000,
        // timeout: 5000,
        enableHighAccuracy: true
    });

})
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
function onEndJourneySuccess(position) { //Position object created by the geolocation API: coords + timestamp
    //Write to db using model.js functions.
    endJourneyInDB(journeyName, endTime); //Write end time to db when stop journey button is clicked.
    addTrackPointToDB(journey_id, position) //Write geolocation to db.
}
function onEndError(error) {
    alert('End Journey Error');
}
$("#stopJourney").on('click', function(){
    var watch_id = null;    // ID of the geolocation
    watchId = navigator.geolocation.getCurrentPosition(onEndJourneySuccess, onEndError);
    navigator.geolocation.clearWatch(watchId); // Stop tracking.
    var journeyName = $('#journeyName').val(); //from #journeyName_field" of home page
    alert('Journey: "' + journeyName + '" ended.');


});

//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************
//*********************************************************************************************************************************************************************

function onCameraSuccess(position, imageURI) {
    var myLat = position.coords.latitude;
    var myLong = position.coords.longitude;
    var time = position.timestamp;
    var myLatLng = new google.maps.LatLng(myLat, myLong);
    map.setCenter(myLatLng);
    photoTracking_data.push(myLatLng);
    photoTime_val.push(time);
    last_values = [myLat, myLong];
    myCoords.push(last_values);

    var photoMarkers = new google.maps.Marker({
        path: tracking_data,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    photoMarkers.setMap(map);

    // var photo = {
    //     uri: imageURI,
    //     position: null
    // }
    alert("onCameraSuccess:" + imageURI);
    addTrackPointToDB(journey_id, position);
    addPhotoToDB(journey_id, position, photo_uri);
    google.maps.event.addDomListener(window, 'load', onCameraSuccess); //https://developers.google.com/maps/documentation/javascript/examples/marker-simple
};


function onCameraError(error) {
    alert('Camera error');
}

// console.log($("#takePhoto")); //evaluates to the object itself
$("#takePhoto").on('click', function() {
    navigator.camera.getPicture(onCameraSuccess, onCameraError, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        saveToPhotoAlbum: true
    });
    var photoWatchId = null;
    photoWatchId = navigator.geolocation.watchPosition(onCameraSuccess, onStartError, { // Start tracking
    frequency: 30000,
    // maximumAge: 3000,
    // timeout: 5000,
    enableHighAccuracy: true
    });
    var photoTracking_data = []; // Array containing GPS position objects for photo. There should only be one location per photo.

});



// function onGetCurrentPositionSuccess(position) {
//     var element = document.getElementById('geolocation');
//     element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
//                         'Longitude: '          + position.coords.longitude             + '<br />' +
//                         'Altitude: '           + position.coords.altitude              + '<br />' +
//                         'Accuracy: '           + position.coords.accuracy              + '<br />' +
//                         'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
//                         'Heading: '            + position.coords.heading               + '<br />' +
//                         'Speed: '              + position.coords.speed                 + '<br />' +
//                         'Timestamp: '          +                                   position.timestamp          + '<br />';
// };

// $("#photoPrompt").on('click', function(){ //THIS IS MAJOR PSEUDOCODE
//     navigator.notification.alert(
//     'Take a photo for your journey.', // message
//     okay,                           // callback
//     'ReJourney Photo Prompt',       // title
//     'OK'                            // buttonName
// );

//     currentLocation = navigator.geolocation.getCurrentPosition(onSuccess, onError, { //
//         frequency: 30000,
//         enableHighAccuracy: true

//     });

// });


