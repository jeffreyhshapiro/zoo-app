var mysql = require('mysql');
var prompt = require('prompt');
prompt.start();
//var password = require('./secret-password.js');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'secret',
    database: 'zoo_db'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    };
    //console.log('connected as id ' + connection.threadId);
});

var zoo = {
  welcome: function(){
    console.log("Welcome to the Zoo and Friends App~!")
  },
  menu: function(){
    console.log("Enter (A): ------> to Add a new animal to the Zoo!")
    console.log("Enter (U): ------> to Update info on an animal in the Zoo!")
    console.log("Enter (V): ------> to Visit the animals in the Zoo!")
    console.log("Enter (D): ------> to Adopt an animal from the Zoo!")
    console.log("Enter (Q): ------> to Quit and exit the Zoo!")
  },
  addEntry: function(input_scope){
    var currentScope = input_scope;
    console.log("To add an animal to the zoo please fill out the following form for us!");
    prompt.get(['->', 'caretaker_id','name', 'type', 'age'], function (err, result) {
      var insertQuery = "INSERT INTO animals(caretaker_id, name, type, age) VALUES(?,?,?,?)";
      connection.query(insertQuery, [result.caretaker_id, result.name, result.type, result.age], function(err, rows) {
        if (err) {throw err};
          console.log(result.name+" has been added to the zoo!");
          zoo.menu()
          zoo.promptUser();
        });
    });
  },
  visit: function(){
    console.log("Enter (I): ------> do you know the animal by it’s id? We will visit that animal!")
    console.log("Enter (N): ------> do you know the animal by it’s name? We will visit that animal!")
    console.log("Enter (A): ------> here’s the count for all animals in all locations!")
    console.log("Enter (C): ------> here’s the count for all animals in this one city!")
    console.log("Enter (O): ------> here’s the count for all the animals in all locations by the type you specified!")
    console.log("Enter (Q): ------> Quits to the main menu!")
    zoo.view()
  },
  view: function(){
    console.log("Please choose what you would like to visit!");
    prompt.get(['->', 'viewOption'], function(err, result){
      if (result.viewOption == 'Q') {
        zoo.menu();
        zoo.promptUser();
      } else if (result.viewOption == "O") {
        zoo.type();
      } else if (result.viewOption == "I") {
        zoo.animId();
      } else if (result.viewOption == "N") {
        zoo.name();
      } else if (result.viewOption == "A") {
        zoo.all();
      } else if (result.viewOption == "C") {
        zoo.care();
      } else {
        console.log("Sorry I didn't get that, come again?");
      }
    });
  },
  type: function(input_scope){
    var currentScope = input_scope
    console.log("Enter an animal type to find out how many animals we have of those type.")
    prompt.get(['->', 'animal_type'], function(err, result){
      if (err) {throw err};
      var queryForTypes = "SELECT * FROM animals WHERE type LIKE '%"+result.animal_type+"%'"; 
      connection.query(queryForTypes, function(err, rows){
        if (err) {throw err};
        for (var i = 0; i < rows.length; i++) {
        };
        console.log("There are "+rows.length+" "+result.animal_type+"s");
        zoo.menu();
        zoo.promptUser();
      });
    });
  },
  care: function(input_scope){
    var currentScope = input_scope;
    console.log("Enter NY or SF as your city:");
    prompt.get(['->', 'city_name'], function(err, result){
      var careQuery = "SELECT * FROM animals LEFT JOIN caretakers ON animals.caretaker_id=caretakers.id WHERE city=?";
      var caretakerCity = result.city_name;
      connection.query(careQuery, caretakerCity, function(err, results){
        if (err) {throw err};
        for (var i = 0; i < results.length; i++) {};
        console.log("There are "+results.length+" animals in your city.");
        zoo.menu();
        zoo.promptUser();
      });
    });
  },
  animId: function(){
    console.log("Enter the ID of the animal you want to visit")
    prompt.get(['->', 'animal_id'], function(err, result){
      var getAnimalById = "SELECT * FROM animals WHERE id=?"
      var animalId = result.animal_id; 
      connection.query(getAnimalById, animalId, function(err, results){
        if (err) {throw err};
        for (var i = 0; i < results.length; i++) {
          console.log("Animal ID " +results[i].id+ " is named "+results[i].name+" and is a type of "+results[i].type+". "+results[i].name+ " is also "+results[i].age+" years old!");
        };
        zoo.menu();
        zoo.promptUser();
      });
    });
  },
  name: function(){
    console.log("Enter the name or part of the name of the animal you want to visit")
    prompt.get(['->', 'animal_name'], function(err, result){
      var getAnimalByName = "SELECT * FROM animals WHERE name LIKE '%"+result.animal_name+"%'";
      connection.query(getAnimalByName, function(err, results){
        if (err) {throw err};
        for (var i = 0; i < results.length; i++) {
          console.log(results[i].name+" is a type of "+results[i].type+" and is ID number "+results[i].id+". "+results[i].name+ "is also "+results[i].age+" years old!");
        };
        if (results.length === 0) {
          console.log("There are no animals here by that name!")
        };
        console.log("Your search yielded "+results.length+" results.");
        zoo.menu();
        zoo.promptUser();
      });
    });
  },
  all: function(){
    var queryForAllAnimals = "SELECT * FROM animals";
    connection.query(queryForAllAnimals, function(err, results){
      for (var i = 0; i < results.length; i++) {
      }
      console.log("There are "+results.length+" total animals in the zoo.  Whoa!");
      zoo.menu();
      zoo.promptUser();
    });
  },
  update: function(){ 
    console.log("Make a better animal from any one of our existing ones! Update it's information here.")
    prompt.get(['—>', 'new_caretaker_id','new_name','new_age','new_type','id'], function(err, result){
      var updateQuery = "UPDATE animals SET caretaker_id="+result.new_caretaker_id+",name='"+result.new_name+"',age='"+result.new_age+"',type='"+result.new_type+"' WHERE id="+result.id;
      connection.query(updateQuery, function(err, results){
        console.log("Animal id "+result.id+" has been successfully updated to "+result.new_name+"!");
        zoo.menu();
        zoo.promptUser();
      });
    });
  },
  adopt: function(){
    console.log("Please enter the id of the animal you would like to adopt!")
    prompt.get(['->','animal_id'], function(err, result){
      var adoptAnimalById = result.animal_id;
      var adoptQuery = "SELECT * FROM animals WHERE id="+adoptAnimalById;
      connection.query(adoptQuery, function(err, results){
        for (var i = 0; i < results.length; i++) {
          console.log("Thank you for adopting animal id " +results[i].id+", " +results[i].name+"!");
        };
        connection.query("DELETE FROM animals WHERE id="+adoptAnimalById, function(err, results){
          if (err) {throw err};
        })
        zoo.menu();
        zoo.promptUser();
      })
    });
  },
  promptUser: function(){
    var self = this;
    prompt.get(['input'], function(err, result){
      if (result.input == "Q") {
        self.exit();
      } else if (result.input == "A") {
        self.addEntry();
      } else if (result.input == "V") {
        self.visit();
      } else if (result.input == "D") {
        self.adopt();
      } else if (result.input == "U") {
        self.update();
      } else {
        console.log("Please choose Q to exit, A to add a new animal, V to visit an animal, and D to adopt!");
        zoo.menu();
        zoo.promptUser();
      };
    });
  },
  exit: function(){
    console.log("Thank you for visiting us, see you next time!")
    connection.end();
  },
  enterZoo: function(){
    this.welcome();
    this.menu();
    this.promptUser();
  },
};

zoo.enterZoo();