var _ = require('lodash'),
    Q = require('q'),
    mongojs = require('mongojs'),
    collection;

collection = mongojs('familytree').collection('people');

function enrich(people) {
    if (_.isUndefined(people) || _.isNull(people)) return;
    return _.extend(people, {
        _id: people._id.toString(),
        isMale: people.gender === 'M'
    });
}

exports = module.exports = {

    getAll: function () {
        return Q.Promise(function (resolve, reject) {
            collection.find().sort({birthDate: 1}, function (err, docs) {
                if (err) return reject(err);
                resolve(_.map(docs, enrich));
            });
        });
    },

    getPeople: function (id) {
        return Q.Promise(function (resolve, reject) {
            collection.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
                if (err) return reject(err);
                resolve(enrich(doc));
            });
        });
    },

    getSeveralPeople: function (idArray) {
        return Q.Promise(function (resolve, reject) {
            collection.find({_id: {$in: idArray}}, function (err, docs) {
                if (err) return reject(err);
                resolve(_.map(docs, enrich));
            });
        });
    },

    getInMenu: function () {
        return Q.Promise(function (resolve, reject) {
            collection.find({menuTab: true}, function (err, docs) {
                if (err) return reject(err);
                resolve(_.map(docs, enrich));
            });
        });
    },

    getChildren: function (parentId) {
        return Q.Promise(function (resolve, reject) {
            collection.find({$or: [{fatherId: parentId}, {motherId: parentId}]})
                .sort({birthDate: 1}, function (err, docs) {
                    if (err) return reject(err);
                    resolve(_.map(docs, enrich));
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
                resolve(enrich(doc));
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
                resolve(enrich(doc));
            });
        });
    }
};
