var ModalOpenerBehavior = Marionette.Behavior.extend({
  ui: {
    actionsBtn: '.actions'
  },

  events: {
    'click @ui.actionsBtn': 'showActionsModal'
  },

  showActionsModal: function (e) {
    e.preventDefault()

    var $el = this.$(e.currentTarget).parent()
    this.$el.append(new ActionsModalView({ target: $el }).render().el)
  }
})
