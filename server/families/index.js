var _ = require('lodash'),
    all = require('./people.json');

function enrichWithMaleBoolean(people) {
    return _.extend(people, {
        isMale: people.gender === 'M'
    });
}

function getPeople(id) {
    var people = _.findWhere(all, {_id: id});
    if (_.isUndefined(people)) return;
    return enrichWithMaleBoolean(people);
}

function getChildren(parentId) {
    var children = _.union(
        _.where(all, {fatherId: parentId}),
        _.where(all, {motherId: parentId}));

    return _.map(children, enrichWithMaleBoolean);
}

exports = module.exports = function (app) {

    app.get('/people', function (req, res) {
        res.send(_.map(all, enrichWithMaleBoolean));
    });

    app.get('/people/:id', function (req, res) {
        var id = req.params.id,
            people = getPeople(id),
            father,
            mother,
            children;

        if (_.isUndefined(people)) {
            res.send(404);
            return;
        }

        father = getPeople(people.fatherId);
        mother = getPeople(people.motherId);
        children = getChildren(id);

        res.send(_.extend({}, people, {
            father: father,
            mother: mother,
            children: children
        }));
    });

};
