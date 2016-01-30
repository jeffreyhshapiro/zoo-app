var mysql = require('mysql');
var password = require('./secret-password.js');
var prompt = require('prompt');
prompt.start()
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

var zoo = {
  welcome: console.log("Welcome to the Zoo and Friends App~!"),
  menu: function(){
          console.log("Enter (A): ------> to Add a new animal to the Zoo!")
          console.log("Enter (U): ------> to Update info on an animal in the Zoo!")
          console.log("Enter (A): ------> to Add a new animal to the Zoo!")
          console.log("Enter (A): ------> to Add a new animal to the Zoo!")
          console.log("Enter (A): ------> to Add a new animal to the Zoo!")
        },
  addEntry: function(input_scope){
    var self = this;
    var currentScope = input_scope;
    console.log("To add an animal to the zoo please fill out the following form for us!");
    prompt.get(['->','name', 'type', 'age'], function (err, result) {
      var insertQuery = "INSERT INTO animals(name, type, age) VALUES(?,?,?)";
      connection.query(insertQuery, function(err, rows) {
      console.log(self.name);
  });
    });
  }
};

zoo.welcome;
zoo.menu();
zoo.addEntry();

connection.end();

/*connection.query('SELECT * FROM animals', function(err, rows, fields) {
  if (err) throw err;
 
  for (var i = 0; i < rows.length; i++) {
    console.log(rows[i].name);
  };
});

prompt.message = "";*/
