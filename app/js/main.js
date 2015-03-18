app
    .on('before:start', function () {
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
        Handlebars.registerHelper('readableDate', function (date) {
            if (_.isUndefined(date)) return '';
            return moment(date).format('D MMMM, YYYY');
        });
    })
    .on('start', function () {
        app.menuRegion.show(new MenuView());
        new Router();
        Backbone.history.start();
    })
    .start();
