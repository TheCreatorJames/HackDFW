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



// Tell the Engine to use Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    secret: 'secretHackDFW',
    saveUninitialized: true,
    resave: true
}));



// Tell the Engine to use Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


// Initialize The Session
function initSession(req)
{
    if(req.session.logged)
    {
    }
    else
    {
        req.session.logged = false;
        req.session.username = "";
    }
    return req.session;
}





// Main Page
app.get("/", function(req, res)
{
    var sess = initSession(req);

    // If Logged in, Display the Dashboard
    if(sess.logged)
    {
        
        res.send("travelData.html");    
    }
    else
    // Otherwise, Display the Home Screen
    {
        res.send("login.html");
    }
});




// Listen
app.listen(30001, function()
{
    console.log("We are listening on port 30001.");
});
