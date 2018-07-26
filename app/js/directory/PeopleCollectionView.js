var PeopleCollectionView = Marionette.CollectionView.extend({
  className: 'row',

  childView: PeopleCardView,

  reorderOnSort: true,

  initialize: function () {
    this.filterValue = ''
    this.listenTo(this.getOption('filterDispatcher'), 'change', this.onFilterChange)
  },

  onFilterChange: function (filterValue) {
    this.filterValue = filterValue
    this.render()
  },

  filter: function (child, index, collection) {
    return [
      child.get('lastName'),
      child.get('maidenName'),
      child.get('firstName')
    ]
      .join(' ')
      .toLowerCase()
      .includes(this.filterValue.toLowerCase())
  }

})
