
// create clean directory blog in SF-WDI-14
// npm install inside the directory
// npm install express --save
// npm start
// touch app.js
// open postgres app = psql = elephant icon on top bar
// create database = blog
// datatable = posts
// boilerplate inside app.js - require express and other stuff
//=========================================
// express = framework that sits on node and extends HTTP module in node so that it makes code easier
var express = require('express');
// updates HTML commands to conform to latest syntax
var methodOverride = require('method-override');
// provides mechanism to embed JS in server side HTML files
var ejs = require('ejs');
// use SQL commands in JS
// db is a custom GA module that is created locally commands in db.js 
var db = require('./db.js');
// Allows Express to read data inside HTML forms and attaches form data to the req.body
var bodyParser = require('body-parser');

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
app.get('/blog', function(req, res) {
	//res.send('Welcome!');
	res.render('index');
});

//lists all posts on one page by title
// read url /blog and do db function respond to browser request when database has provided needed data
app.get('/blog/posts', function(req, res) {
// go to database and get all posts and send it to browser but first ...
	db.query('SELECT * FROM posts;', function(err, dbRes) {
		// if there is no database error continue, if there is a db error go to else statement and report it to browser
		if(!err) {
		// if no error display blog posts on index page
			res.render('posts/index', { posts: dbRes.rows });
		} else {
		// send message to browser saying there is a database error
			res.send('DB error!');
		}
	});
});

// get data for one post from database and show the post on its own page in the browser
app.get('/blog/posts/:id', function(req,res) {
	db.query("SELECT * FROM posts WHERE id = $1", [req.params.id], function(err, dbRes) {
		if(!err) {
			res.render('posts/show', {post: dbRes.rows[0] });
		}
	});
});

// gets blank new blog post form from server
app.get('/blog/new', function(req, res)  {
	res.render('posts/new');
});

// takes completed "new contact" form and adds data to databaase
app.post('/blog/new', function(req, res) {
	var params = [req.body.author, req.body.title, req.body.body];
	db.query("INSERT INTO posts (author, title, body) VALUES ($1, $2, $3)", params, function(err, dbRes) {
		if (!err) {
			res.redirect('/blog/posts');
		}
	});
});

// gets data for one post, populates post edit form, and delivers form to browser
app.get('/blog/posts/:id/edit', function(req, res) {
	db.query("SELECT * FROM posts WHERE id = $1", [req.params.id], function(err, dbRes) {
		if (!err) {
			res.render('posts/edit', {post: dbRes.rows[0] });
		}
	});
});

// reads data from completed "post edit" form, changes database per form, and
// shows changed post in browser
app.patch('/blog/posts/:id', function(req, res) {
	db.query("UPDATE posts SET author = $1, title = $2, body = $3 WHERE id = $4", [req.body.author, req.body.title, req.body.body, req.params.id], function(err, dbRes) {
		if (!err) {
			res.redirect('/blog/posts/' + req.params.id);
		}
	});
});

// listens for click on delete button on single post, show page, and deletes that post from database.  Redirects to index list of posts.
app.delete('/blog/posts/:id', function(req, res) {
	db.query("DELETE FROM posts WHERE id = $1", [req.params.id], function(err, dbRes) {
		if (!err) {
			res.redirect('/blog/posts');
		}
	})
});










