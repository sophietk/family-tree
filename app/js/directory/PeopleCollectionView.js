const PeopleCollectionView = Marionette.CollectionView.extend({
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

  viewFilter: function (view) {
    return [
      view.model.get('lastName'),
      view.model.get('maidenName'),
      view.model.get('firstName')
    ]
      .join(' ')
      .toLowerCase()
      .includes(this.filterValue.toLowerCase())
  }

})
