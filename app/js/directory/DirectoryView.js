var DirectoryView = Backbone.View.extend({

    className: 'row',

    initialize: function () {
        this.collection = new PeopleCollection();
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch();
    },

    render: function () {
        this.collection.each(function (member) {
            this.$el.append(new PeopleCardView({model: member}).render().el);
        }, this);
        return this;
    }

});