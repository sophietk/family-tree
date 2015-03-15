var app = new App();

app
    .on('before:start', function () {
        Marionette.Renderer.render = function (template, data) {
            return Handlebars.compile($(template).html())(data);
        };
        Handlebars.registerPartial('people-link', $('#partial-people-link').html());
    })
    .on('start', function () {
        app.menuRegion.show(new MenuView());
        new Router();
        Backbone.history.start();
    })
    .start();
