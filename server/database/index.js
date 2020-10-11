const { MongoClient, ObjectID } = require('mongodb')
const omit = require('object.omit')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'
const dbName = process.env.DB_NAME || 'familytree'
let collection
let uCollection

console.log(`Connecting to db url: ${dbUrl}, name: ${dbName}`)
MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error when connecting to db', err)
    process.exit(1)
  }
  console.log('Connected to db')
  const database = client.db(dbName)
  collection = database.collection('people')
  uCollection = database.collection('upload')
})

function convert (doc) {
  if (doc === undefined || doc === null) return
  doc._id = doc._id.toString()
  if (doc.gender) doc.isMale = doc.gender === 'M'
  return doc
}

function toObjectId (string) {
  return new ObjectID(string)
}

exports = module.exports = (familyId) => ({
  getAll () {
    return new Promise((resolve, reject) => {
      collection.find({ families: familyId }).sort({ lastName: 1, firstName: 1, birthDate: 1 }).toArray((err, docs) => {
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
      collection.find({ families: familyId, _id: { $in: idArray.map(toObjectId) } }).toArray((err, docs) => {
        if (err) return reject(err)
        resolve(docs.map(convert))
      })
    })
  },

  getInMenu () {
    return new Promise((resolve, reject) => {
      collection.find({ families: familyId, menuTab: true }).toArray((err, docs) => {
        if (err) return reject(err)
        resolve(docs.map(convert))
      })
    })
  },

  getChildren (parentId) {
    return new Promise((resolve, reject) => {
      collection.find({ families: familyId, $or: [{ fatherId: parentId }, { motherId: parentId }] })
        .sort({ birthDate: 1 })
        .toArray((err, docs) => {
          if (err) return reject(err)
          resolve(docs.map(convert))
        })
    })
  },

  replacePeople (id, people, audit) {
    people = omit(people, '_id')
    return new Promise((resolve, reject) => {
      collection.findOneAndUpdate(
        { families: familyId, _id: toObjectId(id) },
        {
          $set: {
            ...people,
            'audit.updatedAt': audit.updatedAt,
            'audit.updatedBy': audit.updatedBy
          }
        },
        (err, result) => {
          if (err) return reject(err)
          console.log('ok and return ', result.value)
          resolve(convert(result.value))
        }
      )
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

  createPeople (people, audit) {
    people.families = [familyId]
    people.audit = audit
    return new Promise((resolve, reject) => {
      collection.insert(people, (err, result) => {
        if (err) return reject(err)
        resolve(convert(result.ops[0]))
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

  createAvatar (avatar, audit) {
    avatar.type = 'avatar'
    avatar.families = [familyId]
    avatar.audit = audit
    return new Promise((resolve, reject) => {
      uCollection.insert(avatar, (err, result) => {
        if (err) return reject(err)
        resolve(convert(result.ops[0]))
      })
    })
  }
})
