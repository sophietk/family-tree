var PeopleCardView = Backbone.View.extend({

    template: $('#tpl-people-card').html(),

    render: function () {
        var rendered = Mustache.render(this.template, this.model.toJSON());
        this.$el.html(rendered);
        return this;
    }

});