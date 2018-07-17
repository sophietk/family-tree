var PeopleCollectionView = Marionette.CollectionView.extend({
  className: 'row',

  childView: PeopleCardView,

  reorderOnSort: true,

  initialize: function () {
    this.listenTo(this.options.filterDispatcher, 'change', this.render)
  },

  filter: function (child, index, collection) {
    return [
      child.get('lastName'),
      child.get('maidenName'),
      child.get('firstName')
    ]
      .join('')
      .toLowerCase()
      .includes(this.options.filterDispatcher.value)
  }

})
