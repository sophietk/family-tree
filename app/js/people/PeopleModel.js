const PeopleModel = Backbone.Model.extend({
  idAttribute: '_id',

  url: function () {
    return '/people' + (this.id ? '/' + this.id : '')
  }

})
