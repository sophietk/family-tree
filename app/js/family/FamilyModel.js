const FamilyModel = Backbone.Model.extend({
  idAttribute: '_id',

  url: function () {
    return `/family/${this.id}`
  }

})
