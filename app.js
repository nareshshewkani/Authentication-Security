//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
require('dotenv').config()

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

mongoose.connect("mongodb://127.0.0.1:27017/authenticationDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

var secret = "thisisourlittlesecret."

userSchema.plugin(encrypt, {secret: process.env.SECRET_KEY, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.get('/login', function(req, res) {
    res.render('login');
});



app.post('/login', function(req, res){
  
    User.findOne(
        {
            email: req.body.username,
        })
    .then(function(result) {
        console.log(result);
        if(result.length==0) {
            console.log('Incorrect email');
        }
        else if(result.password == req.body.password) {
            res.render('secrets');
        }
        else {
            console.log('Incorrect password!');
            console.log(result.password);
        }
    })
    .catch(function(err) {
        console.log(err);
    });

});

app.post('/register', function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
    .then(function() {
        res.render('secrets');
    })
    .catch(function(err) {
        console.log(err);
    });
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});