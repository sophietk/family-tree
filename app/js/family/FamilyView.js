var FamilyView = Marionette.View.extend({
  template: Handlebars.templates['family.hbs'],

  behaviors: {
    ModalOpenerBehavior: {
      behaviorClass: ModalOpenerBehavior
    },
    NavigatorBehavior: {
      behaviorClass: NavigatorBehavior,
      container: '.tree'
    }
  },

  regions: {
    stats: '.stats'
  },

  ui: {
    tree: '.tree',
    withDate: 'input[name="withDate"]',
    withAvatar: 'input[name="withAvatar"]',
    withName: 'input[name="withName"]',
    actionsBtn: '.actions'
  },

  events: {
    'change @ui.withDate, @ui.withAvatar, @ui.withName': 'toggle'
  },

  onRender: function () {
    this.showChildView('stats', new StatsView({model: this.model}))
  },

  onAttach: function () {
    this.centerPeople()
  },

  centerPeople: function () {
    var $a = this.$('a[data-id="' + this.model.id + '"]')
    var top = $a.offset().top
    var left = $a.position().left
    var margin = (this.ui.tree.width() - $a.width()) / 2
    this.ui.tree.animate({scrollLeft: left - margin}, 1000)
    $('body').animate({scrollTop: top - 20}, 1000)
  },

  toggle: function (event) {
    var $el = this.$(event.currentTarget)
    var prop = $el.data('prop')
    var hidden = !$el.prop('checked')
    this.ui.tree.toggleClass('hidden-' + prop, hidden)
  }

})
