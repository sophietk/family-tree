const { MongoClient, ObjectId } = require('mongodb')
const omit = require('object.omit')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'
const dbName = process.env.DB_NAME || 'familytree'
let collection
let uCollection

let connectedDb

const connect = () => {
  const client = new MongoClient(dbUrl)
  client.connect()
  console.log('Connected to MongoDB')
  collection = client.db(dbName).collection('people')
  uCollection = client.db(dbName).collection('upload')

  connectedDb = familyId => {
    return connectedDatabaseForFamily(familyId)
  }
  return connectedDb
}

function convert (doc) {
  if (doc === undefined || doc === null) return
  doc._id = doc._id.toString()
  if (doc.gender) doc.isMale = doc.gender === 'M'
  return doc
}

function toObjectId (string) {
  return new ObjectId(string)
}

const connectedDatabaseForFamily = (familyId) => ({

  getAll () {
    return collection
      .find({ families: familyId })
      .sort({ lastName: 1, firstName: 1, birthDate: 1 })
      .map(convert)
      .toArray()
  },

  async getPeople (id) {
    const found = await collection
      .findOne({ families: familyId, _id: toObjectId(id) })
    return convert(found)
  },

  getSeveralPeople (idArray) {
    return collection
      .find({ families: familyId, _id: { $in: idArray.map(toObjectId) } })
      .map(convert)
      .toArray()
  },

  getInMenu () {
    return collection
      .find({ families: familyId, menuTab: true })
      .map(convert)
      .toArray()
  },

  getChildren (parentId) {
    return collection
      .find({ families: familyId, $or: [{ fatherId: parentId }, { motherId: parentId }] })
      .sort({ birthDate: 1 })
      .map(convert)
      .toArray()
  },

  async replacePeople (id, people, audit) {
    people = omit(people, '_id')
    const updated = await collection.findOneAndUpdate(
      { families: familyId, _id: toObjectId(id) },
      {
        $set: {
          ...people,
          'audit.updatedAt': audit.updatedAt,
          'audit.updatedBy': audit.updatedBy
        }
      })
    return convert(updated)
  },

  deletePeople (id) {
    return collection.deleteOne({ families: familyId, _id: toObjectId(id) })
  },

  async createPeople (people, audit) {
    people.families = [familyId]
    people.audit = audit
    const inserted = await collection.insertOne(people)
    people._id = inserted.insertedId
    return convert(people)
  },

  async getAvatar (id) {
    // @todo: add "families: familyId" in db query
    const found = await uCollection
      .findOne({ _id: toObjectId(id) })
    return convert(found)
  },

  async createAvatar (avatar, audit) {
    avatar.type = 'avatar'
    avatar.families = [familyId]
    avatar.audit = audit
    const inserted = await uCollection.insertOne(avatar)
    avatar._id = inserted.insertedId
    return convert(avatar)
  }
})

exports = module.exports = {
  getConnectedDb: () => connectedDb || connect()
}
