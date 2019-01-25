var StatsView = Marionette.View.extend({
  template: Handlebars.templates['stats.hbs'],

  templateContext: function () {
    var allPeople = this.getAllPeopleInFamily(this.model.toJSON())
    var maleCount = allPeople.filter(people => people.gender === 'M').length
    var femaleCount = allPeople.filter(people => people.gender === 'F').length
    var alivePeople = allPeople.filter(people => !people.deathDate)
    var averageAge = this.getAverageAge(alivePeople)

    return {
      maleCount,
      femaleCount,
      averageAge
    }
  },

  getAllPeopleInFamily: function (familyPeople) {
    const spouses = familyPeople.spouses.filter(spouse => spouse._id !== undefined)
    const children = familyPeople.spouses
      .flatMap(spouse => spouse.children || [])
      .flatMap(child => this.getAllPeopleInFamily(child))

    return [familyPeople, ...spouses, ...children]
  },

  getAverageAge: function (allPeople) {
    var birthDays = allPeople.map(people => people.birthDate)
      .filter(birthDate => !!birthDate)
      .map(birthDate => moment().diff(moment(birthDate), 'days'))

    if (birthDays.length === 0) return

    var averageBirthDays = birthDays.reduce((sum, value) => sum + value) / birthDays.length
    var averageBirthDate = moment().add(-averageBirthDays, 'days')
    return averageBirthDate.fromNow(true)
  }

})
