var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Category = require('../models/category');
var Link = require('../models/link');
var Post = require('../models/post');
var ObjectID = require('mongodb').ObjectID;

router.get('/login', function(req, res) {
    res.render('login');
});

// Register User
router.post('/register', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });

    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('dashboard');
    }
});


router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/user/login', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/dashboard', ensureAuthenticated, function(req, res) {
    Category.find({}, function(err, categories) {
        Link.find({}, function(err, links) {
            res.render('dashboard', {
                categories: categories,
                links: links
            });
        })
    });
});

router.get('/controlpanel', ensureAuthenticated, function(req, res) {
    User.find({}, function(err, users) {
        Post.find({}, function(err, posts) {
            Category.find({}, function(err, categories) {
                Link.find({}, function(err, links) {
                    res.render('controlpanel', {
                        users: users,
                        categories: categories,
                        links: links,
                        posts: posts
                    });
                })
            });
        })
    })
});

router.get('/logout', function(req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

router.post('/addlink', ensureAuthenticated, function(req, res) {

    var name = req.body.linkname,
        url = req.body.url,
        imgsrc = req.body.imgsrc,
        category = req.body.category;

    if (name === '' || url === '' || imgsrc === '' || category == '') {
        console.log("null values entered. Check Yourself. Nothing is created. ");
        res.redirect('/user/dashboard');
        return;
    }

    var newLink = new Link({
        linkname: name,
        url: url,
        imgsrc: imgsrc,
        category: category
    });

    Link.createLink(newLink, function(err, link) {
        if (err) throw err;
        console.log("The link was updated.");
        console.log(link);

        // pass a local variable to the view
        res.redirect('/user/dashboard', link, function(err, html) {
            if (err) throw err;
            console.log('should at least render dashboard');
            res.send(link);
            res.sendStatus(200);
        });
    });
});

router.post('/addcategory', ensureAuthenticated, function(req, res) {
    //res.send(req.body);
    var name = req.body.category[1];

    // No Validation Currently.
    var newCategory = new Category({
        name: name
    });

    Category.createCategory(newCategory, function(err, category) {
        if (err) throw err;
        console.log(category);
        res.send(category);
    });

    //req.flash('success_msg', 'The new category has been added to the database.');
    //res.render('dashboard');
});

router.put('/updatecategory', ensureAuthenticated, function(req, res) {

    Category.findById(req.body.id, function(err, category) {
        if (err) return res.send(500, { error: err });
        category.name = req.body.name;
        category.save(function(err, category) {
            if (err) return res.send(500, { error: err });
            console.log("Successfully Updated...for real this time.")
            res.send(category);
        });
    });

});

router.put('/deletecategory', ensureAuthenticated, function(req, res) {

    Category.findById(req.body.id, function(err, category) {
        if (err) return res.send(500, { error: err });
        category.remove(function(err, category) {
            console.log("removed it.");
            if (err) return res.send(500, { error: err });
            console.log("Successfully Deleted. Thanks for playing.")
            res.send(200);
        });
    });
});

router.put('/deletelink', ensureAuthenticated, function(req, res) {
    Link.findById(req.body.id, function(err, category) {
        if (err) return res.send(500, { error: err });
        link.remove(function(err, category) {
            console.log("removed it.");
            if (err) return res.send(500, { error: err });
            console.log("Link Successfully Deleted. Thanks for playing.")
            res.sendStatus(200);
            res.redirect('/');
        });
    });
});

router.delete('/delete', ensureAuthenticated, function(req, res) {
    // 59c504aca0cb0430f5613506
    value = req.body.text;
    id = req.body.id;

    if (value === "Links") {

        Link.remove({ "_id": ObjectID(id) }, function(err, link) {
            if (err) return res.send(500, { error: err });
            res.sendStatus(200);
        });
    }

    if (value === "Posts") {
        console.log("posts clicked");
        Post.remove({ "_id": ObjectID(id) }, function(err, post) {
            if (err) return res.send(500, { error: err });
            res.sendStatus(200);
        });
    }

    if (value === "Categories") {
        Category.remove({ "_id": ObjectID(id) }, function(err, category) {
            if (err) return res.send(500, { error: err });
            res.sendStatus(200);
        });
    }

    if (value === "Users") {
        User.remove({ "_id": ObjectID(id) }, function(err, user) {
            if (err) return res.send(500, { error: err });
            res.sendStatus(200);
        });
    }
});


router.get('/addpost', ensureAuthenticated, function(req, res) {
    Category.find({}, function(err, categories) {
        Link.find({}, function(err, links) {
            res.render('addpost', {
                categories: categories,
                links: links
            });
        })
    });

});

router.post('/addpost', ensureAuthenticated, function(req, res) {
    var newPost = new Post({
        title: req.body.title,
        state: req.body.state,
        url: req.body.url,
        date: req.body.date,
        contentbrief: req.body.contentbrief,
        contentsummary: req.body.contentsummary,
        category: req.body.category
    });

    console.log("It\'s me");
    Post.createPost(newPost, function(err, post) {
        if (err) throw err;
        console.log("post has been created.");
        res.redirect('/blog');
    });
});

router.get('/editpost/:id', ensureAuthenticated, function(req, res) {
    Category.find({}, function(err, categories) {
        Post.findById(req.params.id, function(err, posts) {
            if (err) {
                next(err);
            } else if (posts) {
                res.render('edit', {
                    posts: posts,
                    categories: categories
                });
            }
        });
    });
});

router.post('/editpost', ensureAuthenticated, function(req, res) {

    console.log(req.body.state);

    Post.findById(req.body.id, function(err, post) {

        if (err) return res.send(500, { error: err });

        post.title = req.body.title || post.title;
        post.state = req.body.state || post.state;
        post.url = req.body.url || post.url;
        post.contentbrief = req.body.contentbrief || post.contentBrief;
        post.contentsummary = req.body.contentsummary || post.contentsummary;
        post.date = req.body.date || post.date;
        post.category = req.body.category || post.category;

        post.save(function(err, post) {
            if (err) return res.send(500, { error: err });
            console.log("Successfully Updated...for real this time.")
            res.redirect('/post/' + req.body.id);
        });
    });

});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/user/dashboard');
    }
}

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


module.exports = router;