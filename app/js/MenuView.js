var MenuView = Marionette.ItemView.extend({

    tagName: 'nav',

    template: '#tpl-menu',

    menuItems: [
        {route: 'home', title: 'Home'},
        {route: 'directory', title: 'Directory'},
        {route: 'family/54f758f3f6a4810a19c3b258', title: 'Anakin’s family', class: 'teal'}
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