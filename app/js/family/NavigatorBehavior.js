var NavigatorBehavior = Marionette.Behavior.extend({

    template: Handlebars.templates['navigation.hbs'],

    ui: function () {
        return {
            left: '.nav-left',
            right: '.nav-right',
            up: '.nav-up',
            down: '.nav-down',
            container: this.options.container
        }
    },

    events: {
        'click @ui.left': 'navigateLeft',
        'click @ui.right': 'navigateRight',
        'click @ui.up': 'navigateUp',
        'click @ui.down': 'navigateDown'
    },

    onShow: function () {
        this.$elNav = $(this.template());
        this.ui.container.parent().prepend(this.$elNav);
        this.step = this.ui.container.width() * 2 / 3;
        this.duration = 300;
        this.glueLimit = this.ui.container.position() ? this.ui.container.position().top - 40 : 0;

        $(window).scroll(_.debounce(_.bind(this.glueNavigation, this), 10));
    },

    glueNavigation: function () {
        if (this.$elNav.css('display') === 'none') {
            return;
        }

        this.$elNav.toggleClass('fixed', $(window).scrollTop() > this.glueLimit);
    },

    navigateLeft: function () {
        this.ui.container.animate({scrollLeft: this.ui.container.scrollLeft() - this.step}, this.duration);
    },

    navigateRight: function () {
        this.ui.container.animate({scrollLeft: this.ui.container.scrollLeft() + this.step}, this.duration);
    },

    navigateUp: function () {
        $('body').animate({scrollTop: $('body').scrollTop() - this.step}, this.duration);
    },

    navigateDown: function () {
        $('body').animate({scrollTop: $('body').scrollTop() + this.step}, this.duration);
    }

});
