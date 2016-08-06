const PeopleModel = Backbone.Model.extend({
  idAttribute: '_id',

  url: function () {
    return this.id ? `/people/${this.id}` : '/people'
  }

})
