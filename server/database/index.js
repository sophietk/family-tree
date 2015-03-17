var _ = require('lodash'),
    all = require('./people.json'),
    fs = require('fs'),
    path = require('path');

function getPeople(id) {
    return _.cloneDeep(_.findWhere(all, {_id: id}));
}

function updateFile() {
    fs.writeFile(path.resolve(__dirname, 'people.json'), JSON.stringify(all), function (err) {
        if (err) return console.log(err);
        console.log('File updated');
    });
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
        updateFile();
    },

    deletePeople: function (id) {
        all = _.without(all, getPeople(id));
        updateFile();
    },

    createPeople: function (people) {
        var id = _.uniqueId();
        people._id = id;
        all.push(people);
        updateFile();
        return id;
    }
};
