var _ = require('lodash'),
    bdd = require('../database'),
    DEFAULT_FAMILY_LEVEL = 4;

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

function buildSpouses(people) {
    if (!_.isUndefined(people.spouses)) return;

    var id = people._id,
        spouses = _.map(people.spousesIds, bdd.getPeople),
        children = getEnrichedChildren(id);

    _.each(children, function (child) {
        var otherParentId = _.without([child.fatherId, child.motherId], id)[0],
            otherParent;
        if (_.isUndefined(otherParentId)) {
            spouses.push({children: [child]});
            return;
        }

        otherParent = _.findWhere(spouses, {_id: otherParentId});
        if (_.isUndefined(otherParent)) {
            spouses.push(_.extend({}, getEnrichedPeople(otherParentId), {children: [child]}));
            return;
        }

        if (_.isUndefined(otherParent.children)) {
            otherParent.children = [];
        }
        otherParent.children.push(child);
    });

    people.oneSpouse = spouses.length === 1;
    people.severalSpouses = spouses.length > 1;
    people.spouses = spouses;
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
            birthDate: req.body.birthDate,
            deathDate: req.body.deathDate,
            fatherId: req.body.fatherId,
            motherId: req.body.motherId,
            about: req.body.about
        });

        res.send(getEnrichedPeople(id));
    });

    app.get('/family/:id', function (req, res) {
        var id = req.params.id,
            level = parseInt(req.query.level) || DEFAULT_FAMILY_LEVEL,
            people = getEnrichedPeople(id);

        if (_.isUndefined(people)) {
            res.sendStatus(404);
            return;
        }

        buildSpouses(people);

        for (var i = 0; i < level; i++) {
            var allChildren = _.flatten(_.pluck(people.spouses, 'children'));
            for (var j = 0; j < i; j++) {
                allChildren = _.flatten(_.pluck(allChildren.spouses, 'children'));
            }
            _.each(allChildren, buildSpouses);
        }

        res.send(people);
    });

};
