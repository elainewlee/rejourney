//TO DO LIST:
// 1. add logic to see if there is a new gps location and ADD accelerometer == 0

// console.log($);

/************************************************* INIT ****************************************************************/
/************************************************* INIT ****************************************************************/
/************************************************* INIT ****************************************************************/
/************************************************* INIT ****************************************************************/
/************************************************* INIT ****************************************************************/


var current_journey = 0;      //Keep track of the last journey in all_journeys
var watch_id = null;    // ID of the geolocation
var photoLocation_id = null; //ID of location the ohto was taken
var journeyTracking_data = []; // Array containing GPS position objects for journey
var photoTracking_data = []; // Array containing GPS position objects for photo. There should only be one location per photo.
var photoTallyForJourney = null; // Variable counting the number of photos taken on the journey.
var db = null;

document.addEventListener("deviceready", function(){
	if(navigator.network.connection.type == Connection.NONE){
		$("#home_network_button").text('No Internet Access')
								 .attr("data-icon", "delete")
								 .button('refresh');
	}
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, readJourneys, fail); //Check if the user will allow you to access filesystem
    db = window.openDatabase("rejourneyDatabase", "1.0", "rejourneyDatabase", 200000);
    // db.transaction(populateDB, errorCB, successCB); //Only run this db transaction line when changing DB schema
    // alert("deviceready");
});


/************************************************* PERSISTANCE ****************************************************************/
/************************************************* PERSISTANCE ****************************************************************/
/************************************************* PERSISTANCE ****************************************************************/
/************************************************* PERSISTANCE ****************************************************************/
/************************************************* PERSISTANCE ****************************************************************/

var all_journeys = [];
function getFileSystem() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, readJourneys, fail);
}
//Fires if we have permissions to access the filesystem
function readJourneys(fileSystem) {
    fileSystem.root.getFile("all_journeys.json", null, gotFileEntry, writeJourneys);
}
//File exists, now we can process it
function gotFileEntry(fileEntry) {
    fileEntry.file(readAsJSON, writeJourneys);
}

function readAsJSON(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        all_journeys = JSON.parse(evt.target.result);//
        if (all_journeys.length != 0) {
            current_journey = all_journeys.length-1;
        }
        console.log('all_journeys loaded');
    };
    reader.readAsText(file);
}

function writeJourneys(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile("all_journeys.json", {create: true, exclusive: false}, createWriter, fail);
    }, fail);
}

function createWriter(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
    writer.onwriteend = function(evt) {
        console.log('all_journeys.json successfully written');
        console.log(all_journeys);
    };
    writer.write(JSON.stringify(all_journeys));
}

function fail(error) {
    console.log(error.code);
}

function populateDB(tx) {
     tx.executeSql('DROP TABLE IF EXISTS Journey');
     tx.executeSql('CREATE TABLE IF NOT EXISTS Journey (journey_id unique, start_time)');
     // tx.executeSql('INSERT INTO Journey (journey_id, start_time) VALUES ("journey 1", ' + Date.now() + ')');
     // tx.executeSql('INSERT INTO Journey (journey_id, start_time) VALUES ("journey 2", ' + Date.now() + ')');
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    alert("db success!");
}




/************************************************* END PERSISTANCE ****************************************************************/



function onNavigationSuccess(position) {
    var myLat = position.coords.latitude;
    var myLong = position.coords.longitude;
    var time = position.timestamp;
    var myLatLng = new google.maps.LatLng(myLat, myLong);
    map.setCenter(myLatLng);
    all_journeys[current_journey].points.push(myLatLng);
    all_journeys[current_journey].times.push(time);

    var trackPath = new google.maps.Polyline({
        path: all_journeys[current_journey].points,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    trackPath.setMap(map);
}

function onError(error) {
    alert('error');
}




$("#startJourney").on('click', function(){
    current_journey++;
    var journey_id = $('#journey_id').val(); //from #journeyName_field" of home page
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO Journey (journey_id, start_time) VALUES ("' + journey_id + '", ' + Date.now() + ')');
    }, errorCB, successCB); //Only run this db transaction line when changing DB schema


    //Set up individual journey JSON object
    // current_journey = {
    //     id: journey_id,
    //     points: [],
    //     photos: [],
    //     start_time: Date.now()

    // };
    // window.localStorage.setItem(journey_id, current_journey); //Save current journey data as dictionary (key, value) in local storage
    watchId = navigator.geolocation.watchPosition(onNavigationSuccess, onError, { // Start tracking
        frequency: 30000,
        enableHighAccuracy: true
    });
    var default_center = new google.maps.LatLng(37.37, 121.92);
    var mapOptions = {
        zoom: 15,
        center: default_center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
});


$("#stopJourney").on('click', function(){
    all_journeys[current_journey].end = Date.now();
    navigator.geolocation.clearWatch(watchId); // Stop tracking
    // window.localStorage.setItem(journey_id, JSON.stringify(journeyTracking_data));
    writeJourneys();// Save the tracking data
});

// console.log($("#takePhoto")); //evaluates to the object itself
$("#takePhoto").on('click', function() {
    navigator.camera.getPicture(onCameraSuccess, onError, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        saveToPhotoAlbum: true
    });
    // navigator.geolocation.getCurrentPosition(onGetCurrentPositionSuccess, onError);
});
function onCameraSuccess(imageURI) {
    var photo = {
        url: imageURI,
        position: null
    }
    alert("onCameraSuccess:" + imageURI);

    navigator.geolocation.getCurrentPosition(function(position){
        photo.position = position;
    });
    all_journeys[current_journey].photos.push(photo);
    writeJourneys();
};
function onError(error) {
    alert('error');
}

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

$("#photoPrompt").on('click', function(){ //THIS IS MAJOR PSEUDOCODE
    navigator.notification.alert(
    'Take a photo for your journey.', // message
    okay,                           // callback
    'ReJourney Photo Prompt',       // title
    'OK'                            // buttonName
);

    currentLocation = navigator.geolocation.getCurrentPosition(onSuccess, onError, { //
        frequency: 30000,
        enableHighAccuracy: true

    });

});



// $("#home_clearstorage_button").on('click', function(){
// 	window.localStorage.clear();
// });

// $("#home_seedgps_button").on('click', function(){
// 	window.localStorage.setItem('Sample block', '[{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700803000,"coords":{"heading":null,"altitude":null,"longitude":170.33481666666665,"accuracy":0,"latitude":-45.87465,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700804000,"coords":{"heading":null,"altitude":null,"longitude":170.33426999999998,"accuracy":0,"latitude":-45.873708333333326,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,"coords":{"heading":null,"altitude":null,"longitude":170.33318333333335,"accuracy":0,"latitude":-45.87178333333333,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700806000,"coords":{"heading":null,"altitude":null,"longitude":170.33416166666666,"accuracy":0,"latitude":-45.871478333333336,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,"coords":{"heading":null,"altitude":null,"longitude":170.33526833333332,"accuracy":0,"latitude":-45.873394999999995,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{"heading":null,"altitude":null,"longitude":170.33427333333336,"accuracy":0,"latitude":-45.873711666666665,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700809000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}}]');

// });

// When the user views the history page
$('#history').on('pageshow', function () {
    function querySuccess(tx, results) {
        var qtyJourneys = results.rows.length;
        // console.log("Journey table: " + len + " rows found.");
        // var ansStr = "";
        // for (var i=0; i<len; i++){
        //     ansStr += "Row = " + i + " Journey = " + results.rows.item(i).journey_id + " Start Time =  " + results.rows.item(i).start_time;
        // }
        // alert(ansStr);
        $("#journeys_recorded").html("<strong>" + qtyJourneys + "</strong> journey(s) recorded");

        // Empty the list of recorded tracks
        $("#history_journeylist").empty();

        // Iterate over all of the recorded tracks, populating the list
        for(i=0; i<qtyJourneys; i++){
            $("#history_journeylist").append("<li><a href='#journey_info' data-ajax='false'>" + results.rows.item(i).journey_id + "</a></li>");
        }

        // Tell jQueryMobile to refresh the list
        $("#history_journeylist").listview('refresh');
    }

    function errorCB(err) {
        alert("Error processing SQL: "+err.code);
    }

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM journey', [], querySuccess, errorCB);
    }, errorCB);
	// Count the number of entries in localStorage and display this information to the user
	// journeys_recorded = window.localStorage.length;


});

// When the user clicks a link to view journey info, set/change the photo_id attribute on the journey_info page.
$("#history_journeylist li a").on('click', function(){
	$("#journey_info").attr("photo_id", $(this).text());
});
// When the user views the Journey Info page
$('#journey_info').on('pageshow', function(){

	// Find the photo_id of the journey they are viewing
	var key = $(this).attr("photo_id");

	// Update the Journey Info page header to the journey_id
	$("#journey_info div[data-role=header] h1").text(key);

	// Get all the GPS data for the specific journey and photos
	var journeyData = window.localStorage.getItem(key);
    var photoData = window.localStorage.getItem(key);

	// Turn the stringified GPS journeyData and photoData back into a JS object
	journeyData = JSON.parse(journeyData);
    photoData = JSON.parse(journeyData);

	// Calculate the total distance travelled
	total_km = 0;

	for(i = 0; i < journeyData.length; i++){

	    if(i == (journeyData.length - 1)){
	        break;
	    }

	    total_km += gps_distance(journeyData[i].coords.latitude, journeyData[i].coords.longitude, journeyData[i+1].coords.latitude, journeyData[i+1].coords.longitude);
	}

	total_km_rounded = total_km.toFixed(2);

	// Calculate the total time taken for the journey
	start_time = new Date(journeyData[0].timestamp).getTime();
	end_time = new Date(journeyData[journeyData.length-1].timestamp).getTime();

	total_time_ms = end_time - start_time;
	total_time_s = total_time_ms / 1000;

	final_time_m = Math.floor(total_time_s / 60);
	final_time_s = total_time_s - (final_time_m * 60);

	// Display total distance and time
	$("#journey_info_info").html('Travelled <strong>' + total_km_rounded + '</strong> km in <strong>' + final_time_m + 'm</strong> and <strong>' + final_time_s + 's</strong>');

    // -------------------------------Plotting the Journey and Photos on the Google Maps---------------------------------------------
	// Set the initial Lat and Long of the Google Map
	var myLatLng = new google.maps.LatLng(journeyData[0].coords.latitude, journeyData[0].coords.longitude);

	// Google Map options
	var myOptions = {
      zoom: 15,
      center: myLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Create the Google Map, set options
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    var journeyCoords = [];
    var photoCoords = [];

    // Add each GPS entry to an array from the journey
    for(i=0; i<journeyData.length; i++){
    	journeyCoords.push(new google.maps.LatLng(journeyData[i].coords.latitude, journeyData[i].coords.longitude));
    }

   // Add each GPS entry to an array from the photos taken on the photo
    for(i=0; i<photoData.length; i++){
        photoCoords.push(new google.maps.LatLng(photoData[i].coords.latitude, photoData[i].coords.longitude));
    }

    // Plot the GPS entries as a line on the Google Map
    var journeyPath = new google.maps.Polyline({
      path: journeyCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    // Apply the line to the map
    journeyPath.setMap(map);

    // Plot the GPS entries from photos as a circles on the Google Map
    var photoMarkers = new google.maps.SymbolPath.CIRCLE({  //var photoMarkers = new google.maps.Marker({
      path: photoCoords,
      fillcolor: "gold",
      fillopacity: 1,
    });
    // Apply the journey line and photo markers to the map
    journeyPath.setMap(map);
    photoMarkers.setMap(map);

});



function gps_distance(lat1, lon1, lat2, lon2)
{
    // http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var dLat = (lat2-lat1) * (Math.PI / 180);
    var dLon = (lon2-lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d;
}