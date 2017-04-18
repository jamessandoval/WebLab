var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LinkSchema = new Schema({
    linkname: String,
    url: String,
    imgsrc: String,
    category: String
});

var Link = module.exports = mongoose.model('Link', LinkSchema);

module.exports.createLink = function(newLink, callback) {
	console.log("create Link");
    newLink.save(callback);

};

