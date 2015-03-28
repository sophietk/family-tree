var PeopleView = Marionette.ItemView.extend({

    template: JST.people,

    initialize: function (options) {
        this.model = new PeopleModel();
        this.model.id = options.peopleId;
        this.listenTo(this.model, 'sync', this.render);
        this.model.fetch();
    }

});