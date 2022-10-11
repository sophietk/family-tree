const ActionsModalView = Marionette.View.extend({
  className: 'modal',

  template: Handlebars.templates['actionsModal.hbs'],

  templateContext: function () {
    const $el = this.getOption('target')
    return {
      _id: $el.data('id'),
      firstName: $el.data('firstName'),
      lastName: $el.data('lastName'),
      isMale: $el.data('gender') === 'M',
      motherId: $el.data('motherId'),
      fatherId: $el.data('fatherId')
    }
  }

})
