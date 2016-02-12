var PeopleView = Marionette.ItemView.extend({

    template: JST.people,

    behaviors: {
        ModalOpenerBehavior: {
            behaviorClass: ModalOpenerBehavior
        }
    }

});