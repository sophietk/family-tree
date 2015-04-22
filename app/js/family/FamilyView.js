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
        'change @ui.withDate': 'toggle',
        'change @ui.withAvatar': 'toggle',
        'change @ui.withName': 'toggle',
        'click @ui.actionsBtn': 'showActionsModal'
    },

    modelEvents: {
        sync: 'render'
    },

    initialize: function (options) {
        this.model = new FamilyModel();
        this.model.id = options.familyId;
        this.model.fetch();

        this.$currentModal = null;
    },

    toggle: function (event) {
        var $el = $(event.currentTarget),
            prop = $el.data('prop'),
            hidden = !$el.prop('checked');
        this.ui.tree.toggleClass('hidden-' + prop, hidden);
    },

    showActionsModal: function (e) {
        e.preventDefault();

        // @todo: create children views
        var $el = $(e.currentTarget).parent();

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