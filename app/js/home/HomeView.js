var HomeView = Marionette.ItemView.extend({

    template: '#tpl-home',

    onShow: function () {
        this.$('.parallax').parallax();
        return this;
    }

});