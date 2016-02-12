var HomeView = Marionette.ItemView.extend({

    className: 'home',

    template: JST.home,

    ui: {
    	parallax: '.parallax'
    },

    onShow: function () {
        this.ui.parallax.parallax();
    }

});