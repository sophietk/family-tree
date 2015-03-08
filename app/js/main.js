var app = new App();

app
    .on('before:start', function () {
        Marionette.Renderer.render = function (template, data) {
            return Mustache.render($(template).html(), data);
        };
    })
    .on('start', function () {
        app.menuRegion.show(new MenuView());
        new Router();
        Backbone.history.start();
    })
    .start();
