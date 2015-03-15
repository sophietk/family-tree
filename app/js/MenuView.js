var MenuView = Marionette.ItemView.extend({

    tagName: 'nav',

    template: '#tpl-menu',

    menuItems: [
        {route: 'home', title: 'Home'},
        {route: 'directory', title: 'Directory'}
    ],

    templateHelpers: function () {
        return {
            items: this.menuItems
        }
    },

    onShow: function () {
        this.$('.button-collapse').sideNav();
    },

    select: function (index) {
        this.$('li').eq(index).addClass('active')
            .siblings().removeClass('active');
    },

    unselect: function () {
        this.$('li').removeClass('active');
    }
});