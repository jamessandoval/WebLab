var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = require('../models/post.js');
var user = require('../models/user.js');
var Category = require('../models/category');
var Link = require('../models/link');

router.get('/', function(req, res) {
    res.render('home');
});

router.get('/indeedapi', function(req, res) {
    res.render('indeedapi');
});

router.get('/blog', function(req, res) {
    Category.find({}, function(err, categories) {
        Link.find({}, function(err, links) {
            Post.find({ state: 'Publish' }, function(err, posts) {
                res.render('blog', {
                    posts: posts,
                    categories: categories,
                    links: links
                });
                //console.log(posts);
            });
        });
    });
});

router.get('/about', function(req, res) {
    Category.find({}, function(err, categories) {
        Link.find({}, function(err, links) {
            Post.find({ title: 'About' }, function(err, posts) {
                res.render('about', {
                    posts: posts,
                    categories: categories,
                    links: links
                });
                console.log(posts);
            });
        });
    });
});

router.get('/algos', function(req, res) {
    Category.find({}, function(err, categories) {
        Link.find({}, function(err, links) {
            Post.find({ category: 'Algorithms' }, function(err, posts) {
                res.render('algos', {
                    posts: posts,
                    categories: categories,
                    links: links
                });
                //console.log(posts);
            });
        });
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

router.get('/post/:id', function(req, res) {

    var id = req.params.id;

    console.log(id);

    Post.findById(id, function(err, posts) {
        if (err) {
            next(err);
        } else if (posts) {
            res.render('post', {
                posts:posts
            });
        }
        //else {
        //
        // next(new Error("Failed to bind post"));
        //   }
    });
});


router.post('/test', function(req, res) {
    console.log(req.body);
    res.send(200);
});



module.exports = router;
