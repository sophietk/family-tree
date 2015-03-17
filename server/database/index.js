var _ = require('lodash'),
    all = require('./people.json');

function getPeople(id) {
    return _.cloneDeep(_.findWhere(all, {_id: id}));
}

exports = module.exports = {

    getAll: function () {
        return _.cloneDeep(all);
    },

    getPeople: getPeople,

    getChildren: function (parentId) {
        return _.cloneDeep(_.union(
            _.where(all, {fatherId: parentId}),
            _.where(all, {motherId: parentId})));
    },

    replacePeople: function (id, people) {
        var index = _.findIndex(all, {_id: id});
        all[index] = people;
    },

    deletePeople: function (id) {
        all = _.without(all, getPeople(id));
    },

    createPeople: function (people) {
        var id = _.uniqueId();
        people._id = id;
        all.push(people);
        return id;
    }
};
