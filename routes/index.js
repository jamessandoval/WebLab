var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Page = require('../models/post.js');
var user = require('../models/user.js');
var Category = require('../models/category');
var Link = require('../models/link');

router.get('/', function(req, res) {
    res.render('home');
});

router.get('/blog', function(req, res) {
	Category.find({}, function(err, categories) {
        Link.find({}, function(err, links) {
            res.render('blog', {
                categories: categories,
                links: links
            });
        })
    });
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
