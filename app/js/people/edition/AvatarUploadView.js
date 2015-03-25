var AvatarUploadView = Marionette.ItemView.extend({

    template: JST.avatarUpload,

    className: 'modal',

    ui: {
        avatarFile: '.js-avatarFile',
        avatarPath: '.js-avatarPath',
        progressBar: '.determinate',
        avatarUploadSave: '.js-avatarUpload-save'
    },

    events: {
        'change @ui.avatarFile': 'updateAvatarFile',
        'click @ui.avatarUploadCancel': 'cancelUploadAvatar',
        'click @ui.avatarUploadSave': 'uploadAvatar'
    },

    initialize: function () {
        this.model = new AvatarModel();
    },

    onRender: function () {
        this.$el.openModal({
                dismissible: false,
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

    uploadAvatarSuccess: function (avatarModel) {
        var uploadedAvatarUrl = avatarModel.get('avatarUrl');
        this.trigger('complete', uploadedAvatarUrl);
        this.$el.closeModal();
    }

});