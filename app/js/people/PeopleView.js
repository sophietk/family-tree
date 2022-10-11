const PeopleView = Marionette.View.extend({
  template: Handlebars.templates['people.hbs'],

  behaviors: {
    ModalOpenerBehavior: {
      behaviorClass: ModalOpenerBehavior
    }
  },

  templateContext: function () {
    return {
      hasParents: this.model.has('fatherId') || this.model.has('motherId')
    }
  }

})
