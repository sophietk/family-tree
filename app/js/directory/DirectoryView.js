var DirectoryView = Marionette.CollectionView.extend({

    className: 'directory row',

    childView: PeopleCardView,

    reorderOnSort: true

});