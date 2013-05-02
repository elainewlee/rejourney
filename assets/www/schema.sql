CREATE TABLE IF NOT EXISTS Journeys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    start INTEGER,
    end INTEGER
)

CREATE TABLE IF NOT EXISTS Tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY(journey_id) REFERENCES Journeys(id), #journey_id INTEGER FOREIGN KEY,
    latitude REAL,
    longitude REAL,
    altitude REAL,
    accuracy REAL,
    altitude_accuracy REAL,
    heading REAL,
    speed REAL,
    timestamp INTEGER #TIMESTAMP?
)

CREATE TABLE IF NOT EXISTS Photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY(journey_id) REFERENCES Journeys(id),
    latitude REAL,
    longitude REAL,
    altitude REAL,
    accuracy REAL,
    altitude_accuracy REAL,
    heading REAL,
    speed REAL,
    timestamp INTEGER, #TIMESTAMP?
    uri TEXT

)