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
    var actionsModalView = new ActionsModalView({ target: $el })
    this.$el.append(actionsModalView.render().el)
    actionsModalView.$el.modal({
      onCloseEnd: actionsModalView.destroy.bind(actionsModalView)
    })
    M.Modal.getInstance(actionsModalView.$el).open()
  }
})
