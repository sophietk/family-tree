var DirectoryView = Marionette.CollectionView.extend({

    className: 'directory row',

    childView: PeopleCardView,

    collectionEvents: {
        sync: 'render'
    },

    initialize: function () {
        this.collection = new PeopleCollection();
        this.collection.fetch();
    }

});