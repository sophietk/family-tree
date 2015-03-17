var _ = require('lodash'),
    all = require('./people.json');

function getPeople(id) {
    return _.findWhere(all, {_id: id});
}

exports = module.exports = {

    getAll: function () {
        return all;
    },

    getPeople: getPeople,

    replacePeople: function (id, people) {
        all[all.indexOf(getPeople(id))] = people;
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
