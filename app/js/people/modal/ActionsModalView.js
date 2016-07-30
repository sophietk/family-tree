var ActionsModalView = Marionette.ItemView.extend({

    className: 'modal actions-modal',

    template: Handlebars.templates['actionsModal.hbs'],

    ui: {
        btns: '.modal-content a'
    },

    events: {
        'click @ui.btns': 'closeModal'
    },

    templateHelpers: function () {
        var $el = this.options.target;
        return {
            _id: $el.data('id'),
            firstName: $el.data('firstName'),
            lastName: $el.data('lastName'),
            isMale: $el.data('gender') === 'M',
            motherId: $el.data('motherId'),
            fatherId: $el.data('fatherId')
        };
    },

    onRender: function () {
        this.$el.openModal({
            complete: _.bind(this.destroy, this)
        });
    },

    closeModal: function () {
        this.$el.closeModal();
    }

});
