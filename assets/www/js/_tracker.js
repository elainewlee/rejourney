var tracking_data = [];
var event_data = []; /// array containing cor. objects
var last_values = [];
var time_val = [];
var watchId = null;
var map = null;
var condition = true;
var pretty = null;
var seconds = null;
var ticker = null;
var myCoords = [];

function tick() {
    if (condition === true) {
        ++seconds;
        var secs = seconds;
        var hrs = Math.floor(secs / 3600);
        secs %= 3600;
        var mns = Math.floor(secs / 60);
        secs %= 60;
        pretty = (hrs < 10 ? "0" : "") + hrs + ":" + (mns < 10 ? "0" : "") + mns + ":" + (secs < 10 ? "0" : "") + secs;
        document.getElementById("ELAPSED").innerHTML = pretty;
    } else {
        document.getElementById("ELAPSED").innerHTML = pretty;
    }
}
function startTimer(condition) {
    seconds = -1;
    ticker = setInterval("tick( )", 1000);
    tick(condition);
}

function gps_distance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    lat1 = lat1 * (Math.PI / 180);
    lat2 = lat2 * (Math.PI / 180);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    console.log(d);
    return d;
}

function walk_distance(){
    var total_km = 0;
    for (i = 0; i < myCoords.length; i++) {
        if (i == (myCoords.length - 1)) {
            break;
        }
        total_km += gps_distance(myCoords[i][0], myCoords[i][1], myCoords[i + 1][0], myCoords[i + 1][1]);
    }
    total_mi = total_km * 0.621371;
    total_mi_rounded = total_mi.toFixed(2);
    return total_mi_rounded;
}

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

function add_maker(icon_name,event_type){
    var location = new google.maps.LatLng(last_values[0], last_values[1]);
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: icon_name
    });
    var event_happened ={};
    event_happened[event_type] = [last_values[0], last_values[1]] ;
    event_data.push(event_happened);
}

function send_map(data,url){
    $.ajax({
        type: 'POST',
        data: {
            json_vals : data
        },
        url: url,
        success: function (data) {
            tracking_data = [];
            event_data = [];
            myCoords = [];
            last_values = [];
            time_val = [];
            alert("Thanks for loggin'! Your log has been sent via text to the dog owner.");
            window.location.href = "#over_view_page";
        },
        error: function (data) {
            alert('There was an error. Please try again.');
        }
    });
}

$("#poop").live('click', function () {
    var poop_image = '../www/css/img/poop.png';
    var event_type="poop";
    add_maker(poop_image,event_type);
});

$("#friend").live('click', function () {
    var friend_image = '../www/css/img/dog_happy.gif';
    var event_type="friend";
    add_maker(friend_image,event_type);
});

$("#frenemy").live('click', function () {
    var frenemy_image = '../www/css/img/dog_sad.gif';
    var event_type="frenemy";
    add_maker(frenemy_image,event_type);
});

$("#pee").live('click', function () {
    var pee_image = '../www/css/img/pee.gif';
    var event_type="pee";
    add_maker(pee_image,event_type);
});

$("#start_logging").live('click', function () {
    var start = Date.now();
    watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
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

$("#end_logging").live('click', function () {
    var end = Date.now();
    var start_time_val = time_val[0];
    var end_time_val = time_val[time_val.length - 1];
    navigator.geolocation.clearWatch(watchId);
    condition = false;
    total_mi_rounded=walk_distance();
    var url = base_url + "/m_save_map";
    var obedience_val = 5;
    var dog_mood_val = 3;
    var pic = "lsjkldf";

    start_time_val = String(start_time_val);
    end_time_val = String(end_time_val);
    var obj = {
        dogwalker_id: dogwalker_id_val,
        obedience_rating: obedience_val,
        dog_mood: dog_mood_val,
        start_time: start_time_val,
        end_time: end_time_val,
        walk_location: tracking_data,
        elapsed_distance: total_mi_rounded,
        elapsed_time: pretty,
        events: event_data,
        walk_pic_url: pic
    };
    data = JSON.stringify(obj);
    send_map(data,url);
    return false;
});