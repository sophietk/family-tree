var EditView = Marionette.ItemView.extend({

    template: '#tpl-people-edit',

    ui: {
        firstName: 'input[name="firstName"]',
        lastName: 'input[name="lastName"]',
        gender: 'input[name="gender"]',
        maidenName: 'input[name="maidenName"]',
        birthDate: 'input[name="birthDate"]',
        deathDate: 'input[name="deathDate"]',
        fatherId: 'select[name="fatherId"]',
        motherId: 'select[name="motherId"]',
        about: 'textarea[name="about"]',

        maidenNameBlock: '.maidenNameBlock',
        button: 'button'
    },

    events: {
        'change @ui.gender': 'updateGender',
        'click @ui.button': 'save'
    },

    initialize: function (options) {
        this.model = new PeopleModel();
        this.model.set('_id', options.peopleId);
        this.listenTo(this.model, 'sync', this.render);
        this.model.fetch();

        this.collection = new PeopleCollection();
        this.listenTo(this.collection, 'sync', this.fillSelects);
        this.collection.fetch();
    },

    onRender: function () {
        this.$('.datepicker').pickadate({
            selectMonths: true,
            selectYears: 15
        });

        this.updateGender();
    },

    fillSelects: function () {
        _.each(this.collection.where({gender: 'M'}), this.fillFatherSelect, this);
        _.each(this.collection.where({gender: 'F'}), this.fillMotherSelect, this);

        this.ui.fatherId.val(this.model.get('fatherId'));
        this.ui.motherId.val(this.model.get('motherId'));
    },

    fillFatherSelect: function (man) {
        this.ui.fatherId.append('<option value="' + man.id + '">' + man.get('firstName') + ' ' + man.get('lastName') + '</option>');
    },

    fillMotherSelect: function (woman) {
        this.ui.motherId.append('<option value="' + woman.id + '">' + woman.get('firstName') + ' ' + woman.get('lastName') + '</option>');
    },

    updateGender: function () {
        this.ui.maidenNameBlock.toggle(this.getGender() === 'F');
    },

    getGender: function () {
        return this.$('input[name="gender"]:checked').val();
    },

    getBirthDate: function () {
        var date = this.ui.birthDate.val();
        if (date === '') return;
        return moment(date).format('YYYY-MM-DD');
    },

    getDeathDate: function () {
        var date = this.ui.deathDate.val();
        if (date === '') return;
        return moment(date).format('YYYY-MM-DD');
    },

    save: function () {
        this.model.save({
            firstName: this.ui.firstName.val(),
            lastName: this.ui.lastName.val(),
            gender: this.getGender(),
            maidenName: this.ui.maidenName.val(),
            birthDate: this.getBirthDate(),
            deathDate: this.getDeathDate(),
            fatherId: this.ui.fatherId.val(),
            motherId: this.ui.motherId.val(),
            about: this.ui.about.val()
        }, {
            success: _.bind(this.saveSuccess, this)
        });
    },

    saveSuccess: function () {
        Backbone.history.navigate('#people/' + this.model.id, {trigger: true});
    }

});