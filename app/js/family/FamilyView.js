var FamilyView = Marionette.ItemView.extend({

    template: '#tpl-family',

    initialize: function (options) {
        this.model = new FamilyModel();
        this.model.set('_id', options.familyId);
        this.listenTo(this.model, 'sync', this.render);
        this.model.fetch();
    }

});