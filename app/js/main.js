var polyglot;

app
    .on('before:start', function () {

        // Handlebars helpers
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
        Handlebars.registerHelper('shortDate', function (date) {
            if (_.isUndefined(date)) return '';
            return moment(date).format('L');
        });
        Handlebars.registerHelper('readableDate', function (date) {
            if (_.isUndefined(date)) return '';
            return moment(date).format('D MMMM, YYYY');
        });
        Handlebars.registerHelper('p', function (phrase, obj) {
            return polyglot.t(phrase, obj);
        });

        // i18n
        var userLang = navigator.language || navigator.userLanguage,
            appLang = userLang === 'fr' ? 'fr' : 'en';
        polyglot = new Polyglot({locale: appLang});
        $('head').append('<script type="text/javascript" src="js/i18n/' + appLang + '.js"></script>');

        // Moment
        moment.locale(appLang);

    })
    .on('start', function () {

        app.menuRegion.show(new MenuView());
        new Router();
        Backbone.history.start();

    })
    .start();
