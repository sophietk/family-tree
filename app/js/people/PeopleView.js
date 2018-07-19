var PeopleView = Marionette.View.extend({
  template: Handlebars.templates['people.hbs'],

  behaviors: {
    ModalOpenerBehavior: {
      behaviorClass: ModalOpenerBehavior
    }
  }

})
