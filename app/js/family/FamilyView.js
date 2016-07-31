var FamilyView = Marionette.ItemView.extend({

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

  onShow: function () {
    this.centerPeople()
  },

  centerPeople: function () {
    var $a = this.$('a[data-id="' + this.model.id + '"]'),
      top = $a.offset().top,
      left = $a.position().left,
      margin = (this.ui.tree.width() - $a.width()) / 2
    this.ui.tree.animate({scrollLeft: left - margin}, 1000)
    $('body').animate({scrollTop: top - 20}, 1000)
  },

  toggle: function (event) {
    var $el = this.$(event.currentTarget),
      prop = $el.data('prop'),
      hidden = !$el.prop('checked')
    this.ui.tree.toggleClass('hidden-' + prop, hidden)
  }

})
