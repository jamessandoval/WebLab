var mongoose = require('mongoose');

var Schema = mongoose.Schema;
    var Postschema = new Schema({
        title: String,
        state: String,
        url: String, 
        date: { type: Date, default: Date.now },
        contentbrief: String,
        contentsummary: String,
        category: String
    });

var Post = module.exports = mongoose.model('Post', Postschema);

module.exports.createPost = function(newPost, callback) {
    console.log("create Post");
    newPost.save(callback);

};

//{type:String, index:{unique:true}},