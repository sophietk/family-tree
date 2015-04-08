var FamilyView = Marionette.ItemView.extend({

    template: JST.family,

    ui: {
        tree: '.tree',
        withDate: 'input[name="withDate"]',
        withAvatar: 'input[name="withAvatar"]',
        withName: 'input[name="withName"]'
    },

    events: {
        'change @ui.withDate': 'toggle',
        'change @ui.withAvatar': 'toggle',
        'change @ui.withName': 'toggle'
    },

    modelEvents: {
        sync: 'render'
    },

    initialize: function (options) {
        this.model = new FamilyModel();
        this.model.id = options.familyId;
        this.model.fetch();
    },

    toggle: function (event) {
        var $el = $(event.currentTarget),
            prop = $el.data('prop'),
            hidden = !$el.prop('checked');
        this.ui.tree.toggleClass('hidden-' + prop, hidden);
    }

});