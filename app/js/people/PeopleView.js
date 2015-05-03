var PeopleView = Marionette.ItemView.extend({

    template: JST.people,

    behaviors: {
        ModalOpenerBehavior: {
            behaviorClass: ModalOpenerBehavior
        }
    },

    modelEvents: {
        sync: 'render'
    },

    initialize: function (options) {
        this.model = new PeopleModel();
        this.model.id = options.peopleId;
        this.model.fetch();
    }

});