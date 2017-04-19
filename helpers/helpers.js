function hbsHelpers(hbs) {
    return hbs.create({
        defaultLayout: 'main',
        helpers: { // This was missing
            inc: function(value, options) {
                console.log('reading it');
                return parseInt(value) + 1;
            },
            equal: function(lvalue, rvalue, options) {
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            },
            bar: function(foo, bar, options) {

                return foo + bar;
            },
            section: function(name, options) {
                if (!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            },
            eachobj: function(items, bars, options) {
                
                var out = "<hr><div class='row'>"
                for (var i = 0, l = items.length; i < l; i++) {

                    var counter = 0;

                    for (var k = 0, m = bars.length; k < m; k++) {
                        if (items[i].name === bars[k].category) {

                                if(counter === 0){
                                    var out = out + "<div class='col-md-12' align='center'><h2>" + items[i].name + "</h2></div>";
                                    
                                }

                            counter++;

                            if (counter === 1) {
                                out = out + "<div class='col-md-2'></div>";
                            }
                            out = out + "<div class='col-md-2' id='" + bars[k]._id + "'><a href='" + bars[k].url + "'  target='_blank' class='thumbnail'><img src='" + bars[k].imgsrc + "' alt='150x150' class='img-thumbnail'><h3 class='caption' align='center'>" + bars[k].linkname + "</h3></a></div>";
                            if (counter === 4) {
                                out = out + "<div class='col-md-2'></div>";
                            }
                        }
                    }
                }
                return out + "</div><hr>";
            },
            // More helpers...
        }
    });
}

module.exports = hbsHelpers;
