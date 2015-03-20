var DB_FILENAME = process.env.DB_FILENAME || 'people.json',
    _ = require('lodash'),
    all = require('./' + DB_FILENAME),
    fs = require('fs'),
    path = require('path');

all = _.sortBy(all, 'birthDate');

function getPeople(id) {
    return _.cloneDeep(_.findWhere(all, {_id: id}));
}

function updateFile() {
    fs.writeFile(path.resolve(__dirname, DB_FILENAME), JSON.stringify(all), function (err) {
        if (err) return console.log(err);
        console.log('File updated');
    });
}

exports = module.exports = {

    getAll: function () {
        return _.cloneDeep(all);
    },

    getPeople: getPeople,

    getInMenu: function () {
        return _.cloneDeep(_.where(all, {menuTab: true}));
    },

    getChildren: function (parentId) {
        return _.cloneDeep(_.union(
            _.where(all, {fatherId: parentId}),
            _.where(all, {motherId: parentId})));
    },

    replacePeople: function (id, people) {
        var index = _.findIndex(all, {_id: id});
        all[index] = people;
        all = _.sortBy(all, 'birthDate');
        updateFile();
    },

    deletePeople: function (id) {
        all = _.reject(all, {_id: id});
        all = _.sortBy(all, 'birthDate');
        updateFile();
    },

    createPeople: function (people) {
        var id = String(new Date().getTime());
        people._id = id;
        all.push(people);
        all = _.sortBy(all, 'birthDate');
        updateFile();
        return id;
    }
};
