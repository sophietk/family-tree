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

exports = module.exports = {
  getAll: function () {
    return new Promise((resolve, reject) => {
      collection.find().sort({birthDate: 1}, function (err, docs) {
        if (err) return reject(err)
        resolve(docs.map(convert))
      })
    })
  },

  getPeople: function (id) {
    return new Promise((resolve, reject) => {
      collection.findOne({_id: toObjectId(id)}, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  getSeveralPeople: function (idArray) {
    return new Promise((resolve, reject) => {
      collection.find({_id: {$in: idArray.map(toObjectId)}}, function (err, docs) {
        if (err) return reject(err)
        resolve(docs.map(convert))
      })
    })
  },

  getInMenu: function () {
    return new Promise((resolve, reject) => {
      collection.find({menuTab: true}, function (err, docs) {
        if (err) return reject(err)
        resolve(docs.map(convert))
      })
    })
  },

  getChildren: function (parentId) {
    return new Promise((resolve, reject) => {
      collection.find({$or: [{fatherId: parentId}, {motherId: parentId}]})
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
        query: {_id: toObjectId(id)},
        update: {$set: people}
      }, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  deletePeople: function (id) {
    return new Promise((resolve, reject) => {
      collection.remove({_id: toObjectId(id)}, true, function (err) {
        if (err) return reject(err)
        resolve()
      })
    })
  },

  createPeople: function (people) {
    return new Promise((resolve, reject) => {
      collection.insert(people, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  getAvatar: function (id) {
    return new Promise((resolve, reject) => {
      uCollection.findOne({_id: toObjectId(id)}, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  createAvatar: function (avatar) {
    avatar.type = 'avatar'
    return new Promise((resolve, reject) => {
      uCollection.insert(avatar, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  }
}
