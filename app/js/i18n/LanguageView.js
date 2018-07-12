var LanguageView = Marionette.ItemView.extend({
  tagName: 'li',

  className: 'language',

  template: Handlebars.templates['language.hbs'],

  events: {
    'click': 'selectLanguage'
  },

  selectLanguage: function () {
    localStorage.setItem('language', this.model.get('code'))
    location.reload()
  }

})
