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
        menuTab: 'input[name="menuTab"]',

        maidenNameBlock: '.js-maidenNameBlock',
        spousesBlock: '.js-spousesBlock',
        addSpouse: '.js-addSpouse',
        removeSpouse: '.js-removeSpouse',
        avatarUpload: '.js-avatarUpload',
        save: '.js-save',
        deleteModal: '#deleteModal',
        delete: '.js-delete',
        deleteConfirm: '.js-delete-confirm'
    },

    events: {
        'change @ui.gender': 'updateGender',
        'click @ui.addSpouse': 'addSpouseSelect',
        'click @ui.removeSpouse': 'removeLastSpouseSelect',
        'click @ui.avatarUpload': 'showAvatarModal',
        'click @ui.save': 'savePeople',
        'click @ui.delete': 'showConfirmDelete',
        'click @ui.deleteCancel': 'cancelDelete',
        'click @ui.deleteConfirm': 'deletePeople'
    },

    modelEvents: {
        sync: 'render',
        error: 'renderError'
    },

    initialize: function (options) {
        this.model = new PeopleModel();

        if (options.peopleId) {
            this.model.set('_id', options.peopleId);
            this.model.fetch();
        }

        this.collection = new PeopleCollection();
        this.listenTo(this.collection, 'sync', this.rejectOneSelf);
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch();
    },

    rejectOneSelf: function () {
        this.collection.remove(this.model.id);
    },

    templateHelpers: function () {
        var manCollection = new Backbone.Collection(this.collection.where({gender: 'M'})),
            womenCollection = new Backbone.Collection(this.collection.where({gender: 'F'}));

        return {
            men: manCollection.toJSON(),
            women: womenCollection.toJSON(),
            people: this.collection.toJSON()
        }
    },

    onRender: function () {
        this.$('.datepicker').pickadate({
            selectMonths: true,
            selectYears: 200,
            monthsFull: moment.months(),
            monthsShort: moment.monthsShort(),
            weekdaysFull: moment.weekdays(),
            weekdaysShort: moment.weekdaysShort(),
            weekdaysLetter: moment.weekdaysMin(),
            today: polyglot.t('datepicker.today'),
            clear: polyglot.t('datepicker.clear'),
            close: polyglot.t('datepicker.close')
        });

        this.updateGender();
        this.updateFatherMotherSpouses();
        this.refreshSpousesButtons();
    },

    renderError: function () {
        this.$el.html('Oops');
    },

    updateGender: function () {
        this.ui.maidenNameBlock.toggle(this.getGender() === 'F');
    },

    updateFatherMotherSpouses: function () {
        // @todo: not necessary, do it in template
        this.ui.fatherId.val(this.model.get('fatherId'));
        this.ui.motherId.val(this.model.get('motherId'));
        _.each(this.model.get('spousesIds'), function fillSpouseSelect(spouseId, index) {
            this.ui.spousesBlock.children().eq(index).val(spouseId);
        }, this);
    },

    addSpouseSelect: function () {
        this.ui.spousesBlock.append(JST.spouseSelect(this.collection.toJSON()));
        this.refreshSpousesButtons();
    },

    removeLastSpouseSelect: function () {
        this.ui.spousesBlock.children().last().remove();
        this.refreshSpousesButtons();
    },

    refreshSpousesButtons: function () {
        var nbSelect = this.ui.spousesBlock.children().size();
        this.ui.removeSpouse.toggleClass('disabled', nbSelect < 1);
    },

    showAvatarModal: function (event) {
        event.preventDefault();

        var avatarUploadView = new AvatarUploadView();
        this.$el.append(avatarUploadView.render().el);
        this.listenToOnce(avatarUploadView, 'complete', this.uploadAvatarSuccess);
    },

    uploadAvatarSuccess: function (uploadedAvatarUrl) {
        this.ui.avatarUrl.val(uploadedAvatarUrl)
            .siblings('label').addClass('active');
    },

    getGender: function () {
        return this.$('input[name="gender"]:checked').val();
    },

    getBirthDate: function () {
        var date = this.ui.birthDate.val();
        if (date === '') return null;
        return moment(date, 'D MMMM, YYYY').format('YYYY-MM-DD');
    },

    getDeathDate: function () {
        var date = this.ui.deathDate.val();
        if (date === '') return null;
        return moment(date, 'D MMMM, YYYY').format('YYYY-MM-DD');
    },

    getSpousesIds: function () {
        return _.compact(this.$('select[name="spouse"]').map(function (index, el) {
            return $(el).val();
        }).get());
    },

    savePeople: function () {
        this.model.save({
            firstName: this.ui.firstName.val(),
            lastName: this.ui.lastName.val(),
            gender: this.getGender(),
            maidenName: this.ui.maidenName.val(),
            birthDate: this.getBirthDate(),
            deathDate: this.getDeathDate(),
            fatherId: this.ui.fatherId.val() || null,
            motherId: this.ui.motherId.val() || null,
            spousesIds: this.getSpousesIds(),
            avatarUrl: this.ui.avatarUrl.val() || null,
            about: this.ui.about.val(),
            menuTab: this.ui.menuTab.prop('checked')
        }, {
            success: _.bind(this.saveSuccess, this)
        });
    },

    showConfirmDelete: function () {
        this.ui.deleteModal.openModal();
    },

    deletePeople: function () {
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