const pick = require('lodash.pick')
const db = require('../database')

const DEFAULT_FAMILY_LEVEL = 10

/**
 * Loop until the promise returned by `fn` returns a truthy value.
 * @see https://www.npmjs.com/package/q-flow
 */
Promise.until = function (fn) {
  return fn().then(result => result || Promise.until(fn))
}

function retrievePeopleFromReq (req) {
  const people = req.body

  /*
  people.forEch(function removeIfEmpty(value, key) {
      if (value === undefined || value === null || value === '') {
          delete people[key]
      }
  })
  */

  return pick(people, [
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
  ])
}

let all = [] // @todo: load async in children each loop
function buildSpousesWithChildren (people) {
  return new Promise(function (resolve, reject) {
    // Spouses are already built
    if (people.spouses !== undefined) return

    const id = people._id
    if (people.spousesIds === undefined) people.spousesIds = []

    Promise.all([
      db.getChildren(id),
      db.getSeveralPeople(people.spousesIds)
    ])
      .then(function (data) {
        const children = data[0]
        const spouses = data[1]

        children.forEach(function (child) {
          const otherParentId = [child.fatherId, child.motherId].find(parentId => parentId !== id)
          if (otherParentId === undefined) {
            spouses.push({children: [child]})
            return
          }

          let otherParent = spouses.find(spouse => spouse._id === otherParentId)
          if (otherParent === undefined) {
            otherParent = all.find(people => people._id === otherParentId)
            spouses.push(Object.assign({}, otherParent, {children: [child]}))
            return
          }

          if (otherParent.children === undefined) {
            otherParent.children = []
          }
          otherParent.children.push(child)
        })

        people.oneSpouse = spouses.length === 1
        people.severalSpouses = spouses.length > 1
        people.spouses = spouses
        resolve()
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

exports = module.exports = function (app) {
  app.get('/menu', function (req, res) {
    db.getInMenu()
      .then(function (dbPeople) {
        res.send(dbPeople)
      })
      .catch(function (err) {
        res.status(500).send(err.message)
      })
  })

  app.get('/people', function (req, res) {
    db.getAll()
      .then(function (dbPeople) {
        res.send(dbPeople)
      })
      .catch(function (err) {
        res.status(500).send(err.message)
      })
  })

  app.post('/people', function (req, res) {
    const people = retrievePeopleFromReq(req)

    db.createPeople(people)
      .then(function (dbPeople) {
        res.send(dbPeople)
      })
      .catch(function (err) {
        res.status(500).send(err.message)
      })
  })

  app.get('/people/:id', function (req, res) {
    const id = req.params.id

    db.getPeople(id)
      .then(function (dbPeople) {
        if (dbPeople === undefined) return res.sendStatus(404)

        Promise.all([
          db.getPeople(dbPeople.fatherId),
          db.getPeople(dbPeople.motherId),
          db.getChildren(dbPeople._id)
        ])
          .then(function (data) {
            res.send(Object.assign({}, dbPeople, {
              father: data[0],
              mother: data[1],
              children: data[2]
            }))
          })
          .catch(function (err) {
            res.status(500).send(err)
          })
      })
      .catch(function (err) {
        res.status(500).send(err.message)
      })
  })

  app.put('/people/:id', function (req, res) {
    const id = req.params.id
    const people = retrievePeopleFromReq(req)

    db.replacePeople(id, people)
      .then(function (dbPeople) {
        res.send(dbPeople)
      })
      .catch(function (err) {
        res.status(500).send(err.message)
      })
  })

  app.delete('/people/:id', function (req, res) {
    const id = req.params.id

    db.deletePeople(id)
      .then(function () {
        res.sendStatus(204)
      })
      .catch(function (err) {
        res.status(500).send(err.message)
      })
  })

  app.get('/family/:id', function (req, res) {
    const id = req.params.id
    const limitLevel = parseInt(req.query.level) || DEFAULT_FAMILY_LEVEL

    Promise.all([
      db.getPeople(id),
      db.getAll()
    ])
      .then(function (data) {
        let currentLevel = 0
        const dbPeople = data[0]
        let allChildrenAtLevel = [dbPeople]
        all = data[1]

        Promise.until(function () {
          const promises = allChildrenAtLevel.map(buildSpousesWithChildren)

          return Promise.all(promises)
            .then(function () {
              currentLevel++
              allChildrenAtLevel = allChildrenAtLevel
                .map(people => people.spouses)
                .reduce((spouses, spouse) => spouses.concat(spouse), [])
                .map(people => people.children)
                .reduce((children, child) => children.concat(child), [])
                .filter(people => people !== undefined)
                .filter(people => people._id !== id) // avoid circular families
              return !!(allChildrenAtLevel.length === 0 || currentLevel >= limitLevel)
            // res.send(dbPeople)
            })
            .catch(function (err) {
              res.status(500).send({message: err.message, stack: err.stack})
            })
        }).then(function () {
          res.send(dbPeople)
        })
      })
      .catch(function (err) {
        res.status(500).send({message: err.message, stack: err.stack})
      })
  })
}
