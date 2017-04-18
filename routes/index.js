var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Page = require('../models/page.js');
var user = require('../models/user.js');

router.get('/', function(req, res) {
    res.render('home');
});

router.get('/blog', function(req, res) {
    res.render('blog');
});

router.get('/algos', function(req, res) {
    res.render('algos')
});

router.get('/resume', function(req, res) {
    res.render('resume');
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.get('/post', function(req, res) {
    res.render('post');
});


module.exports = router;
