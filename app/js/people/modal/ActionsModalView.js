var ActionsModalView = Marionette.View.extend({
  className: 'modal actions-modal',

  template: Handlebars.templates['actionsModal.hbs'],

  ui: {
    btns: '.modal-content a'
  },

  events: {
    'click @ui.btns': 'closeModal'
  },

  templateContext: function () {
    var $el = this.getOption('target')
    return {
      _id: $el.data('id'),
      firstName: $el.data('firstName'),
      lastName: $el.data('lastName'),
      isMale: $el.data('gender') === 'M',
      motherId: $el.data('motherId'),
      fatherId: $el.data('fatherId')
    }
  },

  onRender: function () {
    this.$el.openModal({
      complete: this.destroy.bind(this)
    })
  },

  closeModal: function () {
    this.$el.closeModal()
  }

})
