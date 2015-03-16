var _ = require('lodash'),
    bdd = require('../database');

function enrichWithMaleBoolean(people) {
    return _.extend(people, {
        isMale: people.gender === 'M'
    });
}

function getEnrichedPeople(id) {
    var people = bdd.getPeople(id);
    if (_.isUndefined(people)) return;
    return enrichWithMaleBoolean(people);
}

function getEnrichedChildren(parentId) {
    var children = _.union(
        _.where(bdd.getAll(), {fatherId: parentId}),
        _.where(bdd.getAll(), {motherId: parentId}));

    return _.map(children, enrichWithMaleBoolean);
}

exports = module.exports = function (app) {

    app.get('/people', function (req, res) {
        res.send(_.map(bdd.getAll(), enrichWithMaleBoolean));
    });

    app.get('/people/:id', function (req, res) {
        var id = req.params.id,
            people = getEnrichedPeople(id);

        if (_.isUndefined(people)) {
            res.sendStatus(404);
            return;
        }

        res.send(_.extend({}, people, {
            father: getEnrichedPeople(people.fatherId),
            mother: getEnrichedPeople(people.motherId),
            children: getEnrichedChildren(id)
        }));
    });

    app.put('/people/:id', function (req, res) {
        var id = req.params.id,
            people = bdd.getPeople(id);

        if (_.isUndefined(people)) {
            res.sendStatus(404);
            return;
        }

        _.each(req.body, function removeEmpty(value, key) {
            if (_.isUndefined(value) || _.isNull(value) || _.isEmpty(value)) {
                delete req.body[key];
            }
        });

        bdd.replacePeople(id, {
            _id: req.body._id,
            lastName: req.body.lastName,
            maidenName: req.body.maidenName,
            firstName: req.body.firstName,
            gender: req.body.gender,
            fatherId: req.body.fatherId,
            motherId: req.body.motherId,
            about: req.body.about
        });

        res.send(getEnrichedPeople(id));
    });

};
