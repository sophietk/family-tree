var EditView = Marionette.View.extend({
  template: Handlebars.templates['peopleEdit.hbs'],

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

  initialize: function () {
    this.collection = new PeopleCollection()
    this.listenTo(this.collection, 'sync', this.rejectOneSelf)
    this.listenTo(this.collection, 'sync', this.render)
    this.collection.fetch()
  },

  rejectOneSelf: function () {
    this.collection.remove(this.model.id)
  },

  templateContext: function () {
    var menCollection = new Backbone.Collection(this.collection.where({gender: 'M'}))
    var womenCollection = new Backbone.Collection(this.collection.where({gender: 'F'}))

    return {
      men: menCollection.toJSON(),
      women: womenCollection.toJSON(),
      people: this.collection.toJSON()
    }
  },

  onRender: function () {
    this.updateGender()
    this.updateFatherMotherSpouses()
    this.refreshSpousesButtons()
    this.fillWithQuery()
  },

  fillWithQuery: function () {
    var urlHashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
    urlHashes.forEach(function updateField (hash) {
      hash = hash.split('=')
      switch (hash[0]) {
        case 'lastName':
          this.ui.lastName.val(hash[1]).change()
          break
        case 'gender':
          this.setGender(hash[1])
          break
        case 'motherId':
          this.ui.motherId.val(hash[1])
          break
        case 'fatherId':
          this.ui.fatherId.val(hash[1])
          break
      }
    }, this)
  },

  updateGender: function () {
    this.ui.maidenNameBlock.toggle(this.getGender() === 'F')
  },

  updateFatherMotherSpouses: function () {
    // @todo: not necessary, do it in template
    this.ui.fatherId.val(this.model.get('fatherId'))
    this.ui.motherId.val(this.model.get('motherId'))
    ;(this.model.get('spousesIds') || []).forEach(function fillSpouseSelect (spouseId, index) {
      this.ui.spousesBlock.children().eq(index).val(spouseId)
    }, this)
  },

  addSpouseSelect: function () {
    this.ui.spousesBlock.append(Handlebars.templates['spouseSelect.hbs'](this.collection.toJSON()))
    this.refreshSpousesButtons()
  },

  removeLastSpouseSelect: function () {
    this.ui.spousesBlock.children().last().remove()
    this.refreshSpousesButtons()
  },

  refreshSpousesButtons: function () {
    var nbSelect = this.ui.spousesBlock.children().length
    this.ui.removeSpouse.toggleClass('disabled', nbSelect < 1)
  },

  showAvatarModal: function (event) {
    event.preventDefault()

    var avatarUploadView = new AvatarUploadView({
      model: new AvatarModel(),
      people: {
        firstName: this.ui.firstName.val(),
        lastName: this.ui.lastName.val()
      }
    })
    this.$el.append(avatarUploadView.render().el)
    this.listenToOnce(avatarUploadView, 'complete', this.uploadAvatarSuccess)
  },

  uploadAvatarSuccess: function (uploadedAvatarUrl) {
    this.ui.avatarUrl.val(uploadedAvatarUrl)
      .siblings('label').addClass('active')
  },

  getGender: function () {
    return this.$('input[name="gender"]:checked').val()
  },

  setGender: function (gender) {
    this.$('input[name="gender"][value="' + gender + '"]').prop('checked', true)
    this.updateGender()
  },

  getSpousesIds: function () {
    return this.$('select[name="spouse"]')
      .map(function (index, el) {
        return $(el).val()
      })
      .get()
      .filter(function exist (spouseId) {
        return spouseId !== ''
      })
  },

  savePeople: function () {
    this.model.save({
      firstName: this.ui.firstName.val(),
      lastName: this.ui.lastName.val(),
      gender: this.getGender(),
      maidenName: this.ui.maidenName.val(),
      birthDate: this.ui.birthDate.val(),
      deathDate: this.ui.deathDate.val(),
      fatherId: this.ui.fatherId.val() || null,
      motherId: this.ui.motherId.val() || null,
      spousesIds: this.getSpousesIds(),
      avatarUrl: this.ui.avatarUrl.val() || null,
      about: this.ui.about.val(),
      menuTab: this.ui.menuTab.prop('checked')
    }, {
      success: this.saveSuccess.bind(this)
    })
  },

  showConfirmDelete: function () {
    this.ui.deleteModal.openModal()
  },

  deletePeople: function () {
    this.model.destroy({
      success: this.destroySuccess.bind(this)
    })
  },

  saveSuccess: function () {
    Backbone.history.navigate('#people/' + this.model.id, {trigger: true})
  },

  destroySuccess: function () {
    Backbone.history.navigate('#directory', {trigger: true})
  }

})
