var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: String,
});

var Category = module.exports = mongoose.model('Category', CategorySchema);

module.exports.createCategory = function(newCategory, callback) {
	console.log("create Category");
    newCategory.save(callback);

};

