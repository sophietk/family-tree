var HomeView = Marionette.ItemView.extend({

    className: 'home',

    template: JST.home,

    onShow: function () {
        this.$('.parallax').parallax();
    }

});