var _ = require('lodash'),
    db = require('../database'),
    DEFAULT_FAMILY_LEVEL = 10;

function retrievePeopleFromReq(req) {
    var people = req.body;

    people.spousesIds = _.compact(people.spousesIds);

    _.each(people, function removeIfEmpty(value, key) {
        if (_.isUndefined(value) || _.isNull(value) || (!_.isBoolean(value) && _.isEmpty(value))) {
            delete people[key];
        }
    });

    return _.pick(people,
        '_id',
        'lastName',
        'maidenName',
        'firstName',
        'gender',
        'birthDate',
        'deathDate',
        'fatherId',
        'motherId',
        'spousesIds',
        'avatarUrl',
        'about',
        'menuTab'
    );
}

function enrichWithMaleBoolean(people) {
    return _.extend(people, {
        isMale: people.gender === 'M'
    });
}

function getEnrichedPeople(id) {
    var people = db.getPeople(id);
    if (_.isUndefined(people)) return;
    return enrichWithMaleBoolean(people);
}

function getEnrichedChildren(parentId) {
    var children = db.getChildren(parentId);

    return _.map(children, enrichWithMaleBoolean);
}

function buildSpousesWithChildren(people) {
    if (!_.isUndefined(people.spouses)) return;

    var id = people._id,
        spouses = _.map(people.spousesIds, getEnrichedPeople),
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

    app.get('/menu', function (req, res) {
        res.send(_.map(db.getInMenu(), enrichWithMaleBoolean));
    });

    app.get('/people', function (req, res) {
        res.send(_.map(db.getAll(), enrichWithMaleBoolean));
    });

    app.post('/people', function (req, res) {
        var people = retrievePeopleFromReq(req);

        var id = db.createPeople(people);

        res.send(getEnrichedPeople(id));
    });

    app.delete('/people/:id', function (req, res) {
        var id = req.params.id,
            people = getEnrichedPeople(id);

        if (_.isUndefined(people)) {
            res.sendStatus(404);
            return;
        }

        db.deletePeople(id);
        res.sendStatus(204);
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
            people = db.getPeople(id);

        if (_.isUndefined(people)) {
            res.sendStatus(404);
            return;
        }

        db.replacePeople(id, retrievePeopleFromReq(req));

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

        var allChildrenAtLevel = [people];
        for (var i = 0; i < level; i++) {
            _.each(allChildrenAtLevel, buildSpousesWithChildren);

            allChildrenAtLevel = _.chain(allChildrenAtLevel)
                .pluck('spouses')
                .flatten()
                .pluck('children')
                .flatten()
                .compact()
                .reject({_id: id}) // avoid circular families
                .value();
            if (_.isEmpty(allChildrenAtLevel)) break;
        }

        res.send(people);
    });

};
