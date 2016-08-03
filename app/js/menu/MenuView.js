const MenuView = Marionette.ItemView.extend({
  tagName: 'nav',

  template: Handlebars.templates['menu.hbs'],

  ui: {
    buttonCollapse: '.button-collapse',
    tabs: 'li'
  },

  menuItems: [
    {route: 'home', title: 'tabs.home'},
    {route: 'directory', title: 'tabs.directory'},
    {route: 'people/new', title: 'tabs.create'}
  ],

  initialize: function () {
    this.currentTab = undefined
  },

  addCollectionToMenu: function (collection) {
    collection.each(function transformToMenuItem (people) {
      this.menuItems.push({
        route: 'family/' + people.get('_id'),
        title: 'tabs.pinned',
        args: {firstName: people.get('firstName')},
        className: 'teal'
      })
    }, this)
    this.render()
  },

  templateHelpers: function () {
    return {
      items: this.menuItems
    }
  },

  onRender: function () {
    this.ui.buttonCollapse.sideNav()
    this.updateCurrentTab()
  },

  updateCurrentTab: function () {
    if (this.currentTab === undefined) {
      this.ui.tabs.removeClass('active')
      return
    }

    this.ui.tabs
      .eq(this.currentTab)
      .addClass('active')
      .siblings()
      .removeClass('active')
  },

  select: function (index) {
    this.currentTab = index
    this.updateCurrentTab()
  },

  unselect: function () {
    this.select(undefined)
  }
})
