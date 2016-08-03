const PeopleView = Marionette.ItemView.extend({
  template: Handlebars.templates['people.hbs'],

  behaviors: {
    ModalOpenerBehavior: {
      behaviorClass: ModalOpenerBehavior
    }
  }

})
