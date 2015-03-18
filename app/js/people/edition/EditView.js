var EditView = Marionette.ItemView.extend({

    template: JST.peopleEdit,

    ui: {
        firstName: 'input[name="firstName"]',
        lastName: 'input[name="lastName"]',
        gender: 'input[name="gender"]',
        maidenName: 'input[name="maidenName"]',
        birthDate: 'input[name="birthDate"]',
        deathDate: 'input[name="deathDate"]',
        fatherId: 'select[name="fatherId"]',
        motherId: 'select[name="motherId"]',
        avatarUrl: 'input[name="avatarUrl"]',
        about: 'textarea[name="about"]',

        maidenNameBlock: '.maidenNameBlock',
        addSpouseBlock: '.addSpouseBlock',
        addSpouse: '.addSpouseBlock a',
        submit: 'button[name="submit"]',
        deletePeople: 'button[name="delete"]'
    },

    events: {
        'change @ui.gender': 'updateGender',
        'click @ui.addSpouse': 'addSpouseSelect',
        'click @ui.submit': 'savePeople',
        'click @ui.deletePeople': 'deletePeople'
    },

    initialize: function (options) {
        this.model = new PeopleModel();

        if (options.peopleId) {
            this.model.set('_id', options.peopleId);
            this.listenTo(this.model, 'sync', this.render);
            this.model.fetch();
        } else {
            this.render();
        }

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
        this.collection.remove(this.model.id);
        _.each(this.collection.where({gender: 'M'}), this.fillFatherSelect, this);
        _.each(this.collection.where({gender: 'F'}), this.fillMotherSelect, this);
        this.collection.each(this.fillSpousesSelects, this);

        this.ui.fatherId.val(this.model.get('fatherId'));
        this.ui.motherId.val(this.model.get('motherId'));
        this.$('select[name="spouse"]').each(_.bind(function fillSpouseSelect(index, el) {
            $(el).val(this.model.get('spousesIds')[index]);
        }, this));
    },

    fillFatherSelect: function (man) {
        this.ui.fatherId.append(this.buildOption(man));
    },

    fillMotherSelect: function (woman) {
        this.ui.motherId.append(this.buildOption(woman));
    },

    fillSpousesSelects: function (people) {
        this.$('select[name="spouse"]').each(_.bind(function fillSpouseSelect(index, el) {
            $(el).append(this.buildOption(people));
        }, this));
    },

    buildOption: function (people) {
        return '<option value="' + people.id + '">' + (people.get('firstName') || '') + ' ' + (people.get('lastName') || '') + '</option>';
    },

    updateGender: function () {
        this.ui.maidenNameBlock.toggle(this.getGender() === 'F');
    },

    addSpouseSelect: function () {
        var $spouseSelect = $('<select name="spouse" id="spouse{{@index}}" class="browser-default">'
        + '<option value="" selected>-</option>'
        + '</select>');
        this.ui.addSpouseBlock.append($spouseSelect);
        this.collection.each(function fillSpouseSelect(people) {
            $spouseSelect.append(this.buildOption(people));
        }, this);
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

    getSpousesIds: function () {
        return this.$('select[name="spouse"]').map(function (index, el) {
            return $(el).val();
        }).get();
    },

    savePeople: function (event) {
        event.preventDefault();
        this.model.save({
            firstName: this.ui.firstName.val(),
            lastName: this.ui.lastName.val(),
            gender: this.getGender(),
            maidenName: this.ui.maidenName.val(),
            birthDate: this.getBirthDate(),
            deathDate: this.getDeathDate(),
            fatherId: this.ui.fatherId.val(),
            motherId: this.ui.motherId.val(),
            spousesIds: this.getSpousesIds(),
            avatarUrl: this.ui.avatarUrl.val(),
            about: this.ui.about.val()
        }, {
            success: _.bind(this.saveSuccess, this)
        });
    },

    deletePeople: function (event) {
        event.preventDefault();
        this.model.destroy({
            success: _.bind(this.destroySuccess, this)
        });
    },

    saveSuccess: function () {
        Backbone.history.navigate('#people/' + this.model.id, {trigger: true});
    },

    destroySuccess: function () {
        Backbone.history.navigate('#directory', {trigger: true});
    }

});