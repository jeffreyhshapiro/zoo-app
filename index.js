var mysql = require('mysql');
var password = require('./secret-password.js');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'P0PT@RTs',
    database: 'zoo_db'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    };
    console.log('connected as id ' + connection.threadId);
    console.log("no error!");
});

connection.query('SELECT * FROM animals', function(err, rows, fields) {
  if (err) throw err;
 
  for (var i = 0; i < rows.length; i++) {
    console.log(rows[i].name);
  };
});

connection.end();

/*var prompt = require('prompt');

prompt.start()

prompt.message = "";*/
