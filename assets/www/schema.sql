CREATE TABLE IF NOT EXISTS Journeys (
    id INTEGER PRIMARY KEY,
    name TEXT,
    start INTEGER,
    end INTEGER
)

CREATE TABLE IF NOT EXISTS Tracks (
    id INTEGER PRIMARY KEY,
    journey_id INTEGER FOREIGN KEY,
    latitude REAL,
    longitude REAL,
    altitude REAL,
    accuracy REAL,
    altitude_accuracy REAL,
    heading REAL,
    speed REAL,
    timestamp INTEGER
)

CREATE TABLE IF NOT EXISTS Photos (
    id INTEGER PRIMARY KEY,
    journey_id INTEGER FOREIGN KEY,
    latitude REAL,
    longitude REAL,
    altitude REAL,
    accuracy REAL,
    altitude_accuracy REAL,
    heading REAL,
    speed REAL,
    timestamp INTEGER,
    uri TEXT

)