var app = new App();

app
    .on('before:start', function () {
        Marionette.Renderer.render = function (template, data) {
            return Handlebars.compile($(template).html())(data);
        };
        Handlebars.registerPartial('gender-symbol', $('#partial-gender-symbol').html());
        Handlebars.registerPartial('people-link', $('#partial-people-link').html());
        Handlebars.registerPartial('tree-node', $('#partial-tree-node').html());
        Handlebars.registerHelper('year', function (date) {
            if (_.isUndefined(date)) return '';
            return moment(date).year();
        });
        Handlebars.registerHelper('oneOf', function (obj1, obj2, options) {
            if (_.isUndefined(obj1) && _.isUndefined(obj2)) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        });
    })
    .on('start', function () {
        app.menuRegion.show(new MenuView());
        new Router();
        Backbone.history.start();
    })
    .start();
