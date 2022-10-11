const PeopleCollection = Backbone.Collection.extend({
  model: PeopleModel,

  url: '/people'

})
