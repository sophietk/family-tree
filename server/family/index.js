var _ = require('lodash'),
    Q = require('q'),
    db = require('../database'),
    DEFAULT_FAMILY_LEVEL = 10;

/**
 * Loop until the promise returned by `fn` returns a truthy value.
 * @see https://www.npmjs.com/package/q-flow
 */
Q.until = function (fn) {
    return fn().then(function (result) {
        if (result) {
            return result;
        }

        return Q.until(fn);
    });
};

function retrievePeopleFromReq(req) {
    var people = req.body;

    /*
    _.each(people, function removeIfEmpty(value, key) {
        if (_.isUndefined(value) || _.isNull(value) || (!_.isBoolean(value) && _.isEmpty(value))) {
            delete people[key];
        }
    });
    */

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

var all = []; // @todo: load async in children each loop
function buildSpousesWithChildren(people) {
    return Q.Promise(function (resolve, reject) {
        // Spouses are already built
        if (!_.isUndefined(people.spouses)) return;

        var id = people._id;
        if (_.isUndefined(people.spousesIds)) people.spousesIds = [];

        Q.all([
            db.getChildren(id),
            db.getSeveralPeople(people.spousesIds)
        ])
            .then(function (data) {
                var children = data[0],
                    spouses = data[1];

                _.each(children, function (child) {
                    var otherParentId = _.without([child.fatherId, child.motherId], id)[0],
                        otherParent;
                    if (_.isUndefined(otherParentId)) {
                        spouses.push({children: [child]});
                        return;
                    }

                    otherParent = _.find(spouses, {_id: otherParentId});
                    if (_.isUndefined(otherParent)) {
                        otherParent = _.find(all, {_id: otherParentId});
                        spouses.push(_.extend({}, otherParent, {children: [child]}));
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
                resolve();
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

exports = module.exports = function (app) {

    app.get('/menu', function (req, res) {
        db.getInMenu()
            .then(function (dbPeople) {
                res.send(dbPeople);
            })
            .catch(function (err) {
                res.status(500).send(err.message)
            });
    });

    app.get('/people', function (req, res) {
        db.getAll()
            .then(function (dbPeople) {
                res.send(dbPeople);
            })
            .catch(function (err) {
                res.status(500).send(err.message)
            });
    });

    app.post('/people', function (req, res) {
        var people = retrievePeopleFromReq(req);

        db.createPeople(people)
            .then(function (dbPeople) {
                res.send(dbPeople);
            })
            .catch(function (err) {
                res.status(500).send(err.message)
            });
    });

    app.get('/people/:id', function (req, res) {
        var id = req.params.id;

        db.getPeople(id)
            .then(function (dbPeople) {
                if (_.isUndefined(dbPeople)) return res.sendStatus(404);

                Q.all([
                    db.getPeople(dbPeople.fatherId),
                    db.getPeople(dbPeople.motherId),
                    db.getChildren(dbPeople._id)
                ])
                    .then(function (data) {
                        res.send(_.extend({}, dbPeople, {
                            father: data[0],
                            mother: data[1],
                            children: data[2]
                        }));
                    })
                    .catch(function (err) {
                        res.status(500).send(err)
                    });
            })
            .catch(function (err) {
                res.status(500).send(err.message)
            });

    });

    app.put('/people/:id', function (req, res) {
        var id = req.params.id,
            people = retrievePeopleFromReq(req);

        db.replacePeople(id, people)
            .then(function (dbPeople) {
                res.send(dbPeople);
            })
            .catch(function (err) {
                res.status(500).send(err.message)
            });
    });

    app.delete('/people/:id', function (req, res) {
        var id = req.params.id;

        db.deletePeople(id)
            .then(function () {
                res.sendStatus(204);
            })
            .catch(function (err) {
                res.status(500).send(err.message)
            });
    });

    app.get('/family/:id', function (req, res) {
        var id = req.params.id,
            limitLevel = parseInt(req.query.level) || DEFAULT_FAMILY_LEVEL,
            currentLevel = 0;

        Q.all([
            db.getPeople(id),
            db.getAll()
        ])
            .then(function (data) {
                var dbPeople = data[0],
                    allChildrenAtLevel = [dbPeople];
                all = data[1];

                Q.until(function () {
                    var promises = _.map(allChildrenAtLevel, buildSpousesWithChildren);

                    return Q.all(promises)
                        .then(function () {
                            currentLevel++;
                            allChildrenAtLevel = _(allChildrenAtLevel)
                                .map('spouses')
                                .flatten()
                                .map('children')
                                .flatten()
                                .compact()
                                .reject({_id: id}) // avoid circular families
                                .value();
                            return !!(_.isEmpty(allChildrenAtLevel) || currentLevel >= limitLevel);
                            //res.send(dbPeople);
                        })
                        .catch(function (err) {
                            return true;
                            //res.status(500).send({message: err.message, stack: err.stack});
                        });
                }).done(function () {
                    res.send(dbPeople);
                });

            })
            .catch(function (err) {
                res.status(500).send({message: err.message, stack: err.stack});
            });
    });

};
