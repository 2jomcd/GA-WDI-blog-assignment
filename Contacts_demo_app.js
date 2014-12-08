// 1 db with 1 table
// index.html page with all contacts
// plus show.html for individual contacts
  	  // capability to delete any contact
// plus address creation html page
// plus edit an exisitng contact
// Set up server
// create clean directory in SF-WDI-14
// npm install inside the directory
// npm install express --save
// npm start
// touch app.js
// open postgres app = psql = elephant icon on top bar
// create database people
// datatable 

// boilerplate inside app.js - require express and other stuff
//========================================================================

// express = framework that sits on node and extends HTTP module in node so that it makes code easier
var express = require('express');
// updates HTML commands to conform to latest syntax
var methodOverride = require('method-override');
// provides mecahnism to embed JS in server side HTML files
var ejs = require('ejs');
// use SQL commands in JS
// db is a custom GA module that is created locally commands in db.js 
var db = require('./db.js');
// Allows Express to read data inside HTML forms and attaches form data to the req.body
var bodyParser = require('body-parser');
// calls express on every line that begins with "app"
var app = express();
// extension for html files will be .ejs. so can use just filename in the code without ejs extension
app.set('view engine', 'ejs');

// app.use is middleware for express
// must be in following order
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded())


// Listen on port 3000
app.listen(3000);

// Inform about server start-up
console.log('Server is running!');

// Set up routes
app.get('/', function(req, res) {
	//res.send('Welcome!');
	res.render('index');
});


//lists all contacts on one page
// read url /people and do db function respond to browser request when database has provided needed data
app.get('/people', function(req, res) {

// go to database and get all information on all users serve it up to browser if...
// variable err and dbRes are totally custom to this program and can be anything.  There is no industry standard.
	db.query('SELECT * FROM people;', function(err, dbRes) {
		// if there is no database error continue, if there is a db error go to else statement and report it to browser
		if(!err) {
		// if no error display data on people/index page
		// "dbRes.rows" is a way of retrieving only the data int he database not the entire db file
			res.render('people/index', { people: dbRes.rows });
		} else {
		// send message to browser saying there is a database error
			res.send('DB error!');
		}
	});
});

// gets blank "new contact" form from server
app.get('/people/new', function(req, res)  {
	res.render('people/new');
});

// gets data for one individual from database and shows it in browser
app.get('/people/:id', function(req,res) {
	// "SELECT... is SQL embedded in JS"
	// id = $1  followed by parameter in brackets is required to make it work
	db.query("SELECT * FROM people WHERE id = $1", [req.params.id], function(err, dbRes) {
		if(!err) {
			res.render('people/show', {person: dbRes.rows[0] });
		}
	});
});

// takes completed "new contact" form and adds data to databaase
app.post('/people', function(req, res) {
	var params = [req.body.name, req.body.phone, req.body.email];
	db.query("INSERT INTO people (name, phone, email) VALUES ($1, $2, $3)", params, function(err, dbRes) {
		if (!err) {
			res.redirect('/people');
		}
	});
});

// gets data for one individual, populates contact edit form, and delivers form to browser
app.get('/people/:id/edit', function(req, res) {
	db.query("SELECT * FROM people WHERE id = $1", [req.params.id], function(err, dbRes) {
		if (!err) {
			res.render('people/edit', { person: dbRes.rows[0] });
		}
	});
});

// reads data from completed "contact edit" form and changes database per form
app.patch('/people/:id', function(req, res) {
	db.query("UPDATE people SET name = $1, phone = $2, email = $3 WHERE id = $4", [req.body.name, req.body.phone, req.body.email, req.params.id], function(err, dbRes) {
		if (!err) {
			res.redirect('/people/' + req.params.id);
		}
	});
});


// listens for click on "contact delete" button on single user, display (69-76) and deletes user from database
app.delete('/people/:id', function(req, res) {
	db.query("DELETE FROM people WHERE id = $1", [req.params.id], function(err, dbRes) {
		if (!err) {
			res.redirect('/people');
		}
	})
});
