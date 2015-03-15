var DirectoryView = Marionette.CollectionView.extend({

    className: 'directory row',

    childView: PeopleCardView,

    initialize: function () {
        this.collection = new PeopleCollection();
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch();
    }

});