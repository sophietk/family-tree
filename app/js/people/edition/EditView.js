var EditView = Marionette.ItemView.extend({

    template: '#tpl-people-edit',

    events: {
        'click input[name="gender"]': 'updateGender'
    },

    initialize: function (options) {
        this.model = new PeopleModel();
        this.model.set('_id', options.peopleId);
        this.listenTo(this.model, 'sync', this.render);
        this.model.fetch();

        this.collection = new PeopleCollection();
        this.listenTo(this.collection, 'sync', this.fillSelect);
        this.collection.fetch();
    },

    onRender: function () {
        this.$('.datepicker').pickadate({
            selectMonths: true,
            selectYears: 15
        });

        if (this.model.get('isMale')) {
            this.updateGender();
        }
    },

    fillSelect: function () {
        _.each(this.collection.where({gender: 'M'}), function fillFatherSelect(man) {
            this.$('#fatherId').append('<option value="' + man.id + '">' + man.get('firstName') + ' ' + man.get('lastName') + '</option>');
        }, this);
        _.each(this.collection.where({gender: 'F'}), function fillFatherSelect(woman) {
            this.$('#motherId').append('<option value="' + woman.id + '">' + woman.get('firstName') + ' ' + woman.get('lastName') + '</option>');
        }, this);
        this.$('#fatherId').val(this.model.get('fatherId'));
        this.$('#motherId').val(this.model.get('motherId'));
    },

    updateGender: function () {
        var gender = this.$('input[name="gender"]:checked').val();
        this.$('.maidenNameBlock').toggle(gender === 'F');
    }

});