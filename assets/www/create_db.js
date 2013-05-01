//Create database by reading schema.sql file
function readSQL(fileToRead, transaction) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) { //Fires if we have permissions to access the filesystem, creates object
        fileSystem.root.getFile(fileToRead, null, function (fileEntry) { //getFile is a method that acts on filesystem object to get fileToRead.
            fileEntry.file(function (file) {  //Method reads file if file exists and passes
                var reader = new FileReader();  //Converts bytes from memory to unicode string
                reader.onloadend = function(evt) { //Function that gets called once the reader is done reading
                    createSQLSchema = evt.target.result; // evt.target.result is the string result of the read file.
                    transcation.executeSql(createSQLSchema); // The transaction object accepts the SQL string argument and executes it against the database
                    console.log('Database SQL command sent');
                };
                reader.readAsText(file);
            }, fail);
        }, fail);
    }, fail);
}






