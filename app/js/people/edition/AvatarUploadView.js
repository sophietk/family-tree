var AvatarUploadView = Marionette.ItemView.extend({

    template: Handlebars.templates['avatarUpload.hbs'],

    className: 'modal',

    ui: {
        avatarFile: '.js-avatarFile',
        avatarPath: '.js-avatarPath',
        progressBar: '.determinate',
        avatarUploadSave: '.js-avatarUpload-save'
    },

    events: {
        'change @ui.avatarFile': 'updateAvatarFile',
        'click @ui.avatarUploadSave': 'uploadAvatar'
    },

    templateHelpers: function () {
        return this.options.people;
    },

    onRender: function () {
        this.$el.openModal({
                complete: _.bind(function () {
                    this.destroy();
                }, this)
            }
        );
    },

    updateAvatarFile: function () {
        this.ui.avatarPath.val(this.ui.avatarFile.val());
        this.ui.avatarUploadSave.removeClass('disabled');
    },

    uploadAvatar: function () {
        if (this.ui.avatarUploadSave.hasClass('disabled')) return;

        var fileObject = this.ui.avatarFile[0].files[0];

        this.model.save({
            //peopleId: this.model.id,
            avatarFile: fileObject
        }, {
            success: _.bind(this.uploadAvatarSuccess, this)
        });
        this.model.on('progress', _.bind(function (fraction) {
            this.ui.progressBar.css('width', (fraction * 100) + '%');
        }, this));
    },

    uploadAvatarSuccess: function () {
        var uploadedAvatarUrl = this.model.get('avatarUrl');
        this.trigger('complete', uploadedAvatarUrl);
        this.$el.closeModal();
    }

});
