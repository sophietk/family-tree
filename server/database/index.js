var _ = require('lodash'),
    Q = require('q'),
    mongojs = require('mongojs'),
    dbUrl = process.env.DB_URL || 'family',
    collection,
    uCollection;

console.log('Connecting to db: ' + dbUrl);

collection = mongojs(dbUrl).collection('people');
uCollection = mongojs(dbUrl).collection('upload');

function convert(doc) {
    if (_.isUndefined(doc) || _.isNull(doc)) return;
    doc._id = doc._id.toString();
    if (doc.gender) doc.isMale = doc.gender === 'M';
    return doc;
}

exports = module.exports = {

    getAll: function () {
        return Q.Promise(function (resolve, reject) {
            collection.find().sort({birthDate: 1}, function (err, docs) {
                if (err) return reject(err);
                resolve(_.map(docs, convert));
            });
        });
    },

    getPeople: function (id) {
        return Q.Promise(function (resolve, reject) {
            collection.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
                if (err) return reject(err);
                resolve(convert(doc));
            });
        });
    },

    getSeveralPeople: function (idArray) {
        return Q.Promise(function (resolve, reject) {
            collection.find({_id: {$in: idArray}}, function (err, docs) {
                if (err) return reject(err);
                resolve(_.map(docs, convert));
            });
        });
    },

    getInMenu: function () {
        return Q.Promise(function (resolve, reject) {
            collection.find({menuTab: true}, function (err, docs) {
                if (err) return reject(err);
                resolve(_.map(docs, convert));
            });
        });
    },

    getChildren: function (parentId) {
        return Q.Promise(function (resolve, reject) {
            collection.find({$or: [{fatherId: parentId}, {motherId: parentId}]})
                .sort({birthDate: 1}, function (err, docs) {
                    if (err) return reject(err);
                    resolve(_.map(docs, convert));
                });
        });
    },

    replacePeople: function (id, people) {
        people = _.omit(people, '_id');
        return Q.Promise(function (resolve, reject) {
            collection.findAndModify({
                query: {_id: mongojs.ObjectId(id)},
                update: {$set: people}
            }, function (err, doc) {
                if (err) return reject(err);
                resolve(convert(doc));
            });
        });
    },

    deletePeople: function (id) {
        return Q.Promise(function (resolve, reject) {
            collection.remove({_id: mongojs.ObjectId(id)}, true, function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    },

    createPeople: function (people) {
        return Q.Promise(function (resolve, reject) {
            collection.insert(people, function (err, doc) {
                if (err) return reject(err);
                resolve(convert(doc));
            });
        });
    },

    getAvatar: function (id) {
        return Q.Promise(function (resolve, reject) {
            uCollection.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
                if (err) return reject(err);
                resolve(convert(doc));
            });
        });
    },

    createAvatar: function (avatar) {
        avatar.type = 'avatar';
        return Q.Promise(function (resolve, reject) {
            uCollection.insert(avatar, function (err, doc) {
                if (err) return reject(err);
                resolve(convert(doc));
            });
        });
    }
};
