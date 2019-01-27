var AvatarUploadView = Marionette.View.extend({
  template: Handlebars.templates['avatarUpload.hbs'],

  className: 'modal',

  ui: {
    avatarFile: '.js-avatarFile',
    progressBar: '.determinate',
    avatarUploadSave: '.js-avatarUpload-save'
  },

  events: {
    'change @ui.avatarFile': 'updateAvatarFile',
    'click @ui.avatarUploadSave': 'uploadAvatar'
  },

  templateContext: function () {
    return this.getOption('people')
  },

  updateAvatarFile: function () {
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
    M.Modal.getInstance(this.$el).close()
  }

})
