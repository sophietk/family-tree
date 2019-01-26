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
  getAll () {
    return new Promise((resolve, reject) => {
      collection.find({ families: familyId }).sort({ lastName: 1, firstName: 1, birthDate: 1 }, (err, docs) => {
        if (err) return reject(err)
        resolve(docs.map(convert))
      })
    })
  },

  getPeople (id) {
    return new Promise((resolve, reject) => {
      collection.findOne({ families: familyId, _id: toObjectId(id) }, (err, doc) => {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  getSeveralPeople (idArray) {
    return new Promise((resolve, reject) => {
      collection.find({ families: familyId, _id: { $in: idArray.map(toObjectId) } }, (err, docs) => {
        if (err) return reject(err)
        resolve(docs.map(convert))
      })
    })
  },

  getInMenu () {
    return new Promise((resolve, reject) => {
      collection.find({ families: familyId, menuTab: true }, (err, docs) => {
        if (err) return reject(err)
        resolve(docs.map(convert))
      })
    })
  },

  getChildren (parentId) {
    return new Promise((resolve, reject) => {
      collection.find({ families: familyId, $or: [{ fatherId: parentId }, { motherId: parentId }] })
        .sort({ birthDate: 1 }, (err, docs) => {
          if (err) return reject(err)
          resolve(docs.map(convert))
        })
    })
  },

  replacePeople (id, people) {
    people = omit(people, '_id')
    return new Promise((resolve, reject) => {
      collection.findAndModify({
        query: { families: familyId, _id: toObjectId(id) },
        update: { $set: people }
      }, (err, doc) => {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  deletePeople (id) {
    return new Promise((resolve, reject) => {
      collection.remove({ families: familyId, _id: toObjectId(id) }, true, err => {
        if (err) return reject(err)
        resolve()
      })
    })
  },

  createPeople (people) {
    return new Promise((resolve, reject) => {
      people.families = [familyId]
      collection.insert(people, (err, doc) => {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  getAvatar (id) {
    return new Promise((resolve, reject) => {
      // @todo: add "families: familyId" in db query
      uCollection.findOne({ _id: toObjectId(id) }, (err, doc) => {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  },

  createAvatar (avatar) {
    avatar.type = 'avatar'
    avatar.families = [familyId]
    return new Promise((resolve, reject) => {
      uCollection.insert(avatar, (err, doc) => {
        if (err) return reject(err)
        resolve(convert(doc))
      })
    })
  }
})
