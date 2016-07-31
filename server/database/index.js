var _ = require('lodash')
var mongojs = require('mongojs')

var dbUrl = process.env.DB_URL || 'familytree'
var db
var collection
var uCollection

console.log('Connecting to db: ' + dbUrl)

db = mongojs(dbUrl, ['people', 'upload'])

collection = db.collection('people')
uCollection = db.collection('upload')

function convert (doc) {
  if (_.isUndefined(doc) || _.isNull(doc)) return
  doc._id = doc._id.toString()
  if (doc.gender) doc.isMale = doc.gender === 'M'
  return doc
}

function toObjectId (string) {
  return mongojs.ObjectId(string)
}

exports = module.exports = {
  getAll: function () {
    return new Promise(function (resolve, reject) {
      collection.find().sort({birthDate: 1}, function (err, docs) {
        if (err) return reject(err)
        resolve(_.map(docs, convert))
      })
    })
  },

  getPeople: function (id) {
    return new Promise(function (resolve, reject) {
      collection.findOne({_id: toObjectId(id)}, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  getSeveralPeople: function (idArray) {
    return new Promise(function (resolve, reject) {
      collection.find({_id: {$in: _.map(idArray, toObjectId)}}, function (err, docs) {
        if (err) return reject(err)
        resolve(_.map(docs, convert))
      })
    })
  },

  getInMenu: function () {
    return new Promise(function (resolve, reject) {
      collection.find({menuTab: true}, function (err, docs) {
        if (err) return reject(err)
        resolve(_.map(docs, convert))
      })
    })
  },

  getChildren: function (parentId) {
    return new Promise(function (resolve, reject) {
      collection.find({$or: [{fatherId: parentId}, {motherId: parentId}]})
        .sort({birthDate: 1}, function (err, docs) {
          if (err) return reject(err)
          resolve(_.map(docs, convert))
        })
    })
  },

  replacePeople: function (id, people) {
    people = _.omit(people, '_id')
    return new Promise(function (resolve, reject) {
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
    return new Promise(function (resolve, reject) {
      collection.remove({_id: toObjectId(id)}, true, function (err) {
        if (err) return reject(err)
        resolve()
      })
    })
  },

  createPeople: function (people) {
    return new Promise(function (resolve, reject) {
      collection.insert(people, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  getAvatar: function (id) {
    return new Promise(function (resolve, reject) {
      uCollection.findOne({_id: toObjectId(id)}, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  createAvatar: function (avatar) {
    avatar.type = 'avatar'
    return new Promise(function (resolve, reject) {
      uCollection.insert(avatar, function (err, doc) {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  }
}
