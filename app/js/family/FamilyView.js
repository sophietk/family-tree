var FamilyView = Marionette.ItemView.extend({

    template: JST.family,

    ui: {
        tree: '.tree',
        withDate: 'input[name="withDate"]',
        withAvatar: 'input[name="withAvatar"]',
        withName: 'input[name="withName"]',
        actionsBtn: '.actions',
        actionsModal: '.actions-modal'
    },

    events: {
        'change @ui.withDate, @ui.withAvatar, @ui.withName': 'toggle',
        'click @ui.actionsBtn': 'showActionsModal'
    },

    modelEvents: {
        sync: 'renderSuccess'
    },

    initialize: function (options) {
        this.model = new FamilyModel();
        this.model.id = options.familyId;
        this.model.fetch();
    },

    renderSuccess: function () {
        this.render();
        this.centerPeople();
    },

    centerPeople: function () {
        var $a = this.$('a[data-id="' + this.model.id + '"]'),
            top = $a.offset().top,
            left = $a.position().left,
            margin = (this.ui.tree.width() - $a.width()) / 2;
        this.ui.tree.animate({scrollLeft: left - margin}, 1000);
        $('body').animate({scrollTop: top - 20}, 1000);
    },

    toggle: function (event) {
        var $el = this.$(event.currentTarget),
            prop = $el.data('prop'),
            hidden = !$el.prop('checked');
        this.ui.tree.toggleClass('hidden-' + prop, hidden);
    },

    showActionsModal: function (e) {
        e.preventDefault();

        // @todo: create children views
        var $el = this.$(e.currentTarget).parent();

        this.ui.actionsModal.html(JST.actionsModal({
            _id: $el.data('id'),
            firstName: $el.data('firstName'),
            lastName: $el.data('lastName'),
            isMale: $el.data('gender') === 'M',
            motherId: $el.data('motherId'),
            fatherId: $el.data('fatherId')
        }));
        this.ui.actionsModal.openModal();
    }

});