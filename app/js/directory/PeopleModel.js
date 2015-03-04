var PeopleModel = Backbone.Model.extend({

    parse: function (json) {
        json.isMale = json.gender === 'M';
        return json;
    }

});
