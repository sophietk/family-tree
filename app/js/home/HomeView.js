var HomeView = Marionette.ItemView.extend({

    template: JST.home,

    onShow: function () {
        this.$('.parallax').parallax();
        return this;
    }

});