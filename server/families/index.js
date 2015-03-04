var _ = require('lodash'),
    people = require('./people.json');

exports = module.exports = function (app) {

    app.get('/people/:id', function (req, res) {
        var id = req.params.id,
            member = _.findWhere(people, {_id: id}),
            isMale,
            father,
            mother,
            children;

        if (_.isUndefined(member)) {
            res.send(404);
            return;
        }

        isMale = member.gender === 'M';
        father = _.findWhere(people, {_id: member.fatherId});
        mother = _.findWhere(people, {_id: member.motherId});
        children = _.where(people, isMale ? {fatherId: id} : {motherId: id});

        res.send(_.extend({}, member, {
            father: father,
            mother: mother,
            children: children
        }));
    });

};
