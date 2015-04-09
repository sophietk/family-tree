var DirectoryView = Marionette.CollectionView.extend({

    className: 'directory row',

    childView: PeopleCardView,

    reorderOnSort: true,

    collectionEvents: {
        sync: 'sortByBirthDateDesc'
    },

    initialize: function () {
        this.collection = new PeopleCollection();
        this.collection.fetch();
    },

    sortByBirthDateDesc: function () {
        this.collection.models.reverse();
        this.collection.trigger('sort');
    }

});