var DirectoryView = Marionette.View.extend({
  className: 'directory',

  template: Handlebars.templates['directory.hbs'],

  regions: {
    search: '.search',
    people: '.people'
  },

  initialize: function () {
    this.filterDispatcher = _.extend({value: ''}, Backbone.Events)
  },

  onRender: function () {
    this.showChildView('search', new SearchView({filterDispatcher: this.filterDispatcher}))
    this.showChildView('people', new PeopleCollectionView({collection: this.collection, filterDispatcher: this.filterDispatcher}))
  }

})
