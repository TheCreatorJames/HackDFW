var DataStore = require('nedb');
var express = require('express');
var session = require('express-session');
var path = require('path');
var url = require('url');
var passport = require('passport');
var bcrypt = require('bcryptjs');

// Create and load the users database.
var users = new DataStore({ filename: "data/users.db", autoload: true });


// Init App
var app = express();

// Assign Folders 
app.use(express.static(__dirname + "/html"));
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/css"));

