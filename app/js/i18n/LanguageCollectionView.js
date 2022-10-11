const LanguageCollectionView = Marionette.CollectionView.extend({
  tagName: 'ul',

  childView: LanguageView,

  collection: new Backbone.Collection([
    { code: 'en' },
    { code: 'fr' }
  ])

})
