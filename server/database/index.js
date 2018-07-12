const mongojs = require('mongojs')
const omit = require('object.omit')

const dbUrl = process.env.DB_URL || 'familytree'
console.log(`Connecting to db: ${dbUrl}`)
const db = mongojs(dbUrl, ['people', 'upload'])
const collection = db.collection('people')
const uCollection = db.collection('upload')

function convert (doc) {
  if (doc === undefined || doc === null) return
  doc._id = doc._id.toString()
  if (doc.gender) doc.isMale = doc.gender === 'M'
  return doc
}

function toObjectId (string) {
  return mongojs.ObjectId(string)
}

exports = module.exports = (familyId) => ({
  getAll: function () {
    return new Promise((resolve, reject) => {
      collection.find({families: familyId}).sort({lastName: -1, firstName: -1, birthDate: -1}, function (err, docs) {
        if (err) return reject(err)
        resolve(docs.map(convert))
      })
    })
  },

  getPeople: function (id) {
    return new Promise((resolve, reject) => {
      collection.findOne({families: familyId, _id: toObjectId(id)}, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  getSeveralPeople: function (idArray) {
    return new Promise((resolve, reject) => {
      collection.find({families: familyId, _id: {$in: idArray.map(toObjectId)}}, function (err, docs) {
        if (err) return reject(err)
        resolve(docs.map(convert))
      })
    })
  },

  getInMenu: function () {
    return new Promise((resolve, reject) => {
      collection.find({families: familyId, menuTab: true}, function (err, docs) {
        if (err) return reject(err)
        resolve(docs.map(convert))
      })
    })
  },

  getChildren: function (parentId) {
    return new Promise((resolve, reject) => {
      collection.find({families: familyId, $or: [{fatherId: parentId}, {motherId: parentId}]})
        .sort({birthDate: 1}, function (err, docs) {
          if (err) return reject(err)
          resolve(docs.map(convert))
        })
    })
  },

  replacePeople: function (id, people) {
    people = omit(people, '_id')
    return new Promise((resolve, reject) => {
      collection.findAndModify({
        query: {families: familyId, _id: toObjectId(id)},
        update: {$set: people}
      }, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  deletePeople: function (id) {
    return new Promise((resolve, reject) => {
      collection.remove({families: familyId, _id: toObjectId(id)}, true, function (err) {
        if (err) return reject(err)
        resolve()
      })
    })
  },

  createPeople: function (people) {
    return new Promise((resolve, reject) => {
      people.families = [familyId]
      collection.insert(people, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  getAvatar: function (id) {
    return new Promise((resolve, reject) => {
      // @todo: add "families: familyId" in db query
      uCollection.findOne({_id: toObjectId(id)}, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  createAvatar: function (avatar) {
    avatar.type = 'avatar'
    avatar.families = [familyId]
    return new Promise((resolve, reject) => {
      uCollection.insert(avatar, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  }
})
