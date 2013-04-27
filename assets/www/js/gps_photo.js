//TO DO LIST:
// 1. add logic to see if there is a new gps location and ADD accelerometer == 0


/*
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

document.addEventListener("deviceready", function(){

	if(navigator.network.connection.type == Connection.NONE){
		$("#home_network_button").text('No Internet Access')
								 .attr("data-icon", "delete")
								 .button('refresh');
	}

});

function onSuccess(position) {
    var myLat = position.coords.latitude;
    var myLong = position.coords.longitude;
    var time = position.timestamp;
    var myLatLng = new google.maps.LatLng(myLat, myLong);
    map.setCenter(myLatLng);
    tracking_data.push(myLatLng);
    time_val.push(time);
    last_values = [myLat, myLong];
    myCoords.push(last_values);

    var trackPath = new google.maps.Polyline({
        path: tracking_data,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    trackPath.setMap(map);
}

function onError(error) {
    alert('error');
}

var journey_id = '';      // Name/ID of the exercise
var watch_id = null;    // ID of the geolocation
var photoLocation_id = null; //ID of location the ohto was taken
var x = []; // Array containing GPS position objects for journey
var photoTracking_data = []; // Array containing GPS position objects for photo. There should only be one location per photo.
var photoTallyForJourney = null; // Variable counting the number of photos taken on the journey.

$("#startJourney").live('click', function(){
    var start = Date.now();
    watchId = navigator.geolocation.watchPosition(onSuccess, onError, { // Start tracking
        frequency: 30000,
        enableHighAccuracy: true
    });
    var default_center = new google.maps.LatLng(37.37, 121.92);
    pretty = null;
    condition = true;
    var mapOptions = {
        zoom: 15,
        center: default_center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    startTimer(true);
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
});


$("#stopJourney").live('click', function(){
    var end = Date.now();
    var start_time_val = time_val[0];
    var end_time_val = time_val[time_val.length - 1];
    navigator.geolocation.clearWatch(watchId); // Stop tracking
    window.localStorage.setItem(journey_id, JSON.stringify(journeyTracking_data)); // Save the tracking data
    // condition = false;
    // total_mi_rounded=walk_distance();
    // var url = base_url + "/m_save_map";
    // var obedience_val = 5;
    // var dog_mood_val = 3;
    // var pic = "lsjkldf";

    start_time_val = String(start_time_val);
    end_time_val = String(end_time_val);
    // var obj = {
    //     dogwalker_id: dogwalker_id_val,
    //     obedience_rating: obedience_val,
    //     dog_mood: dog_mood_val,
    //     start_time: start_time_val,
    //     end_time: end_time_val,
    //     walk_location: tracking_data,
    //     elapsed_distance: total_mi_rounded,
    //     elapsed_time: pretty,
    //     events: event_data,
    //     walk_pic_url: pic
    // };
    // data = JSON.stringify(obj);
    // // send_map(data,url);
    // return false;

    // Reset journey variables
    var watch_id = null;
    var journeyTracking_data = null;
    var photoTracking_data = null;
    var photoTallyForJourney = null;
});

$("#photoPrompt").live('click', function(){ //THIS IS MAJOR PSEUDOCODE
    currentLocation = navigator.geolocation.getCurrentPosition(onSuccess, onError, { //
        frequency: 30000,
        enableHighAccuracy: true

    });

});

*/
$("#takePhoto").live('click', function() {
    alert("Hello");

    /*photoLocation_id = navigator.geolocation.getCurrentPosition(

        // Success
        function(position){
            photoTracking_data.push(position);
            photoTallyForJourney += 1;
        },

        // Error
        function(error){
            console.log(error);
        },

        // Settings
        { frequency: 3000, enableHighAccuracy: true });

    // Tidy up the UI
    $("#photo_id").val("").show();
    $("#lat").text (lat);
    $("#lng").text (lng);
    $("#takePhoto_status").html("Photo: <strong>" + photo_id + "</strong>"); //$("#startTracking_status").html("Stopped tracking workout: <strong>" + photo_id + "</strong>");
*/
});
/*
$("#home_clearstorage_button").live('click', function(){
	window.localStorage.clear();
});

$("#home_seedgps_button").live('click', function(){
	window.localStorage.setItem('Sample block', '[{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700803000,"coords":{"heading":null,"altitude":null,"longitude":170.33481666666665,"accuracy":0,"latitude":-45.87465,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700804000,"coords":{"heading":null,"altitude":null,"longitude":170.33426999999998,"accuracy":0,"latitude":-45.873708333333326,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,"coords":{"heading":null,"altitude":null,"longitude":170.33318333333335,"accuracy":0,"latitude":-45.87178333333333,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700806000,"coords":{"heading":null,"altitude":null,"longitude":170.33416166666666,"accuracy":0,"latitude":-45.871478333333336,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,"coords":{"heading":null,"altitude":null,"longitude":170.33526833333332,"accuracy":0,"latitude":-45.873394999999995,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{"heading":null,"altitude":null,"longitude":170.33427333333336,"accuracy":0,"latitude":-45.873711666666665,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700809000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}}]');

});

// When the user views the history page
$('#history').live('pageshow', function () {

	// Count the number of entries in localStorage and display this information to the user
	journeys_recorded = window.localStorage.length;
	$("#journeys_recorded").html("<strong>" + journeys_recorded + "</strong> journey(s) recorded");

	// Empty the list of recorded tracks
	$("#history_journeylist").empty();

	// Iterate over all of the recorded tracks, populating the list
	for(i=0; i<journeys_recorded; i++){
		$("#history_journeylist").append("<li><a href='#journey_info' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
	}

	// Tell jQueryMobile to refresh the list
	$("#history_journeylist").listview('refresh');

});

// When the user clicks a link to view journey info, set/change the photo_id attribute on the journey_info page.
$("#history_journeylist li a").live('click', function(){
	$("#journey_info").attr("photo_id", $(this).text());
});
// When the user views the Journey Info page
$('#journey_info').live('pageshow', function(){

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
*/

//______________________CODE GRAVEYARD________________________________

// $("#startJourney").live('click', function(){ //$("#startTracking_start").live('click', function(){

//     // Start tracking the User
//     watch_id = navigator.geolocation.watchPosition(

//         // Success
//         function(position){
//             journeyTracking_data.push(position);
//         },

//         // Error
//         function(error){
//             console.log(error);
//         },

//         // Settings
//         { frequency: 3000, enableHighAccuracy: true });

//     // Tidy up the UI
//     journey_id = $("#journey_id").val();

//     $("#journey_id").hide();

//     $("#takePhoto_status").html("Journey: <strong>" + journey_id + "</strong> started.");
// });


// $("#stopJourney").live('click', function(){ // $("#startTracking_stop").live('click', function(){

//     // Stop tracking the user
//     navigator.geolocation.clearWatch(watch_id);

//     // Save the tracking data
//     window.localStorage.setItem(journey_id, JSON.stringify(journeyTracking_data));

//     // Reset journey variables
//     var watch_id = null;
//     var journeyTracking_data = null;
//     var photoTracking_data = null;
//     var photoTallyForJourney = null;

//     // Tidy up the UI
//     $("#journey_id").val("").show();

//     $("#takePhoto_status").html("Journey: <strong>" + journey_id + "</strong> stopped. You took <strong>" + photoTallyForJourney + "</strong> photos on this journey."); //$("#startTracking_status").html("Stopped tracking workout: <strong>" + photo_id + "</strong>");

// });