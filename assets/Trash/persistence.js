
// var current_journey = 0;      //Keep track of the last journey in all_journeys
// var watch_id = null;    // ID of the geolocation
// var photoLocation_id = null; //ID of location the ohto was taken
// var journeyTracking_data = []; // Array containing GPS position objects for journey
// var photoTracking_data = []; // Array containing GPS position objects for photo. There should only be one location per photo.
// var photoTallyForJourney = null; // Variable counting the number of photos taken on the journey.

var db = null;
//*********************************************************************************************************************************************************************

document.addEventListener("deviceready", function(){  //Anon function for onDeviceReady.
	if(navigator.network.connection.type == Connection.NONE){
		$("#home_network_button").text('No Internet Access')
								 .attr("data-icon", "delete")
								 .button('refresh');
	}
    // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, readJourneys, fail); //Check if the user will allow you to access filesystem
    createDB();
    getSQLResults();
});

function createDB(){
    if(!db){
        db = window.openDatabase("ReJourneyDB", "1.0", "ReJourneyDB", 200000); //This method will create a new SQL Lite Database and return a Database object.
    }
    db.transaction(populateDB, errorCB, successCB); //Run transaction to create initial tables
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    alert("db success!");
}

//Populate database functions.
function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Journeys (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start INTEGER, end INTEGER)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tracks (id INTEGER PRIMARY KEY AUTOINCREMENT, FOREIGN KEY(journey_id) REFERENCES Journeys(id), timestamp INTEGER)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Photos (id INTEGER PRIMARY KEY AUTOINCREMENT, FOREIGN KEY(journey_id) REFERENCES Journeys(id), latitude REAL, longitude REAL, timestamp INTEGER, uri TEXT)');
    // tx.executeSql('INSERT INTO Journeys(name, start, end) values(?,?,?)', ["erer",1,2]); //Test to adding data to db
}

function queryDB(tx){
    tx.executeSql(
        'SELECT * FROM Journeys', [], querySuccess, errorCB);
}

function querySuccess(tx, results){
    console.log(results.rows.length);
}

function getSQLResults(){
    if(!db){
        ("rejourneyDatabase", "1.0", "ReJourneyDB", 200000);
    }
        db.transaction(queryDB,errorCB);
    }

function addTrackPointToDB(journey_id, position) {
    db.transaction(function(transaction){ //The SQL var is in place of populateDB.
        SQL = 'INSERT INTO Tracks (journey_id, latitude, longitude, altitude, accuracy, altitude_accuracy, heading, speed, timestamp, uri)';
        SQL += "VALUES (" + journey_id + "," + position.latitude + "," + position.longitude + "," + position.accuracy + "," + position.altitude_accuracy + "," + position.heading + "," + position.speed + "," + position.timestamp + ")";
    }, errorCB, successCB);
}

function addPhotoToDB(journey_id, photo_uri, position) {
    db.transaction(function(transaction){ //The SQL var is in place of populateDB.
        SQL = 'INSERT INTO Photos (journey_id, latitude, longitude, altitude, accuracy, altitude_accuracy, heading, speed, timestamp, uri)';
        SQL += "VALUES (" + journey_id + "," + position.latitude + "," + position.longitude + "," + position.accuracy + "," + position.altitude_accuracy + "," + position.heading + "," + position.speed + "," + position.timestamp + "," + photo_uri + ")";
    }, errorCB, successCB);
}


