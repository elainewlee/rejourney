var db = null;
//*********************************************************************************************************************************************************************

document.addEventListener("deviceready", function(){  //Anon function for onDeviceReady.
    // alert('device ready');
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
    alert("errorCB: Error processing SQL: "+ err.message);
}

function successCB() {
    // alert("db success!");
}

//Populate database functions.
function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Journeys (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start INTEGER, end INTEGER)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tracks (id INTEGER PRIMARY KEY AUTOINCREMENT, journey_id INTEGER, timestamp INTEGER, FOREIGN KEY(journey_id) REFERENCES Journeys(id))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Photos (id INTEGER PRIMARY KEY AUTOINCREMENT, journey_id INTEGER, latitude REAL, longitude REAL, timestamp INTEGER, uri TEXT, FOREIGN KEY(journey_id) REFERENCES Journeys(id))');
    // tx.executeSql('INSERT INTO Journeys(name) values(?)', journeyName); //Write journey name to db when start journey button is clicked.
    // tx.executeSql('INSERT INTO Tracks(journey_id, latitude, longitude) values(?,?,?)', [journey_id, startLat, startLong]);
}

function queryDB(tx){
    tx.executeSql(
        'SELECT * FROM Journeys', [], querySuccess, errorCB);
}

function querySuccess(tx, results){
    console.log('results.rows.length' + results.rows.length);
}

function getSQLResults(){
    if(!db){
        ("rejourneyDatabase", "1.0", "ReJourneyDB", 200000);
    }
        db.transaction(queryDB,errorCB);
    }
//*********************************************DATABASE MANIPULATION VIA HTML PAGE BUTTONS********************************************************************
function addJourneyToDB(journeyName, startTime) {
    alert('Inside addJourneyToDB');
    db.transaction(function(transaction){ //The SQL var is the sql string statement, in place of populateDB.
        alert('Inside; db.transaction(function(transaction). transaction = ' + transaction);
        var SQL = 'INSERT INTO Journeys (name, start) ';
        SQL += "VALUES ('" + journeyName + "'," + startTime + ")";
        alert( 'SQL: ' + SQL);
        transaction.executeSql(SQL);
    }, errorCB, successCB);
}

function endJourneyInDB(journeyName, endTime) {
    db.transaction(function(transaction){ //The SQL var is the sql string statement, in place of populateDB.
        SQL = 'INSERT INTO Journeys (end) WHERE name = ' + journeyName;
        SQL += "VALUES (" + endTime + ")";
        transaction.executeSql(SQL);
    }, errorCB, successCB);
}

function addTrackPointToDB(journey_id, position) {
    db.transaction(function(transaction){ //The SQL var is the sql string statement, in place of populateDB.
        SQL = 'INSERT INTO Tracks (journey_id, latitude, longitude, timestamp) WHERE journey_id = ' + journey_id;
        SQL += "VALUES (" + journey_id + "," + position.latitude + "," + position.longitude + "," + position.timestamp + ")";
        transaction.executeSql(SQL);
    }, errorCB, successCB);
}

function addPhotoToDB(journey_id, position, photo_uri) {
    db.transaction(function(transaction){ //The SQL var is the sql string statement, in place of populateDB.
        SQL = 'INSERT INTO Photos (journey_id, latitude, longitude, timestamp, uri) WHERE journey_id ==' + journey_id;
        SQL += "VALUES (" + journey_id + "," + position.latitude + "," + position.longitude + "," + position.timestamp + uri + ")";
        transaction.executeSql(SQL);
    }, errorCB, successCB);
}
    // //Write data to db
    // db.transaction(function(tx) {
    //     tx.executeSql('INSERT INTO Journey (name, start) VALUES ("' + journeyName + '", ' + Date.now() + ')'); //Insert Journet name and current time.
    //     tx.executeSql('INSERT INTO Tracks (latitude, longitude, timestamp) VALUES ("' + journeyName + '", ' + Date.now() + ')'); //Insert Journet name and current time.
    // }, errorCB, successCB);
