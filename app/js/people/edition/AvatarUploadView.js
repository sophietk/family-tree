var AvatarUploadView = Marionette.View.extend({
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

  templateContext: function () {
    return this.options.people
  },

  onRender: function () {
    this.$el.openModal({
      complete: this.destroy.bind(this)
    })
  },

  updateAvatarFile: function () {
    this.ui.avatarPath.val(this.ui.avatarFile.val())
    this.ui.avatarUploadSave.removeClass('disabled')
  },

  uploadAvatar: function () {
    if (this.ui.avatarUploadSave.hasClass('disabled')) return

    var fileObject = this.ui.avatarFile[0].files[0]

    this.model.save({
      // peopleId: this.model.id,
      avatarFile: fileObject
    }, {
      success: this.uploadAvatarSuccess.bind(this)
    })
    this.model.on('progress', function (fraction) {
      this.ui.progressBar.css('width', (fraction * 100) + '%')
    }.bind(this))
  },

  uploadAvatarSuccess: function () {
    var uploadedAvatarUrl = this.model.get('avatarUrl')
    this.trigger('complete', uploadedAvatarUrl)
    this.$el.closeModal()
  }

})
