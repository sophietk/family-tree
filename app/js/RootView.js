var RootView = Marionette.View.extend({
  template: Handlebars.templates['root.hbs'],

  regions: {
    menu: '.menu',
    languages: '.languages',
    main: 'main',
    nude: '.nude'
  },

  initialize: function () {
    this.getRegion('menu').show(new MenuView())
    this.getRegion('languages').show(new LanguageCollectionView())

    new MenuCollection()
      .on('sync', function (collection) {
        this.getRegion('menu').currentView.addCollectionToMenu(collection)
      }.bind(this))
      .fetch()
  },

  showHome: function () {
    this.getRegion('nude').show(new HomeView())
    this.getRegion('menu').currentView.select(0)
    this.getRegion('main').reset()
  },

  showDirectory: function () {
    this.getRegion('nude').reset()
    this.getRegion('menu').currentView.select(1)
    this.getRegion('main').show(new LoaderView())

    new PeopleCollection()
      .on('sync', function (collection) {
        collection.models.reverse()
        this.getRegion('main').show(new DirectoryView({collection: collection}))
      }.bind(this))
      .fetch()
  },

  showCreatePeople: function () {
    this.getRegion('nude').reset()
    this.getRegion('menu').currentView.select(2)
    this.getRegion('main').show(new EditView({model: new PeopleModel()}))
  },

  showPeople: function (peopleId) {
    this.getRegion('nude').reset()
    this.getRegion('menu').currentView.unselect()
    this.getRegion('main').show(new LoaderView())

    new PeopleModel({_id: peopleId})
      .on('sync', function (model) {
        this.getRegion('main').show(new PeopleView({model: model}))
      }.bind(this))
      .fetch()
  },

  showEditPeople: function (peopleId) {
    this.getRegion('nude').reset()
    this.getRegion('menu').currentView.unselect()
    this.getRegion('main').show(new LoaderView())

    new PeopleModel({_id: peopleId})
      .on('sync', function (model) {
        this.getRegion('main').show(new EditView({model: model}))
      }.bind(this))
      .fetch()
  },

  showFamily: function (peopleId) {
    this.getRegion('nude').reset()
    this.getRegion('menu').currentView.unselect()
    this.getRegion('main').show(new LoaderView())

    new FamilyModel({_id: peopleId})
      .on('sync', function (model) {
        this.getRegion('main').show(new FamilyView({model: model}))
      }.bind(this))
      .fetch()
  }
})
