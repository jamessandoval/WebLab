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

                var out = "<div class='row'>";

                for (var i = 0, l = items.length; i < l; i++) {
                    out = out + "<div class='col-md-12' style='align-content:center;'>" + items[i].name + "</div>";
                    for (var k = 0, m = bars.length; k < m; k++) {
                        if (items[i].name === bars[k].category) {
                            out = out + "<div class='col-md-3'>" + bars[k].category + "</div>";
                        }
                    }
                }

                return out + "</div>";
                // More helpers...
            }
        }
    });
}

module.exports = hbsHelpers;
