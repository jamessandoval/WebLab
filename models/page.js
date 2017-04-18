var mongoose = require('mongoose');

var Schema = mongoose.Schema;
    var Page = new Schema({
        title: String,
        state: String,
        url: {type:String, index:{unique:true}},
        date: Date,
        contentbrief: String,
        contentsummary: String,
        category: String
    });
    var Page = mongoose.model('Page', Page);

module.exports=Page;