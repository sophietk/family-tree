var StatsView = Marionette.View.extend({
  template: Handlebars.templates['stats.hbs'],

  templateContext: function () {
    var allPeople = this.getAllPeopleInFamily(this.model.toJSON())
    var maleCount = allPeople.filter(function (people) { return people.gender === 'M' }).length
    var femaleCount = allPeople.filter(function (people) { return people.gender === 'F' }).length
    var alivePeople = allPeople.filter(function (people) { return !people.deathDate })
    var averageAge = this.getAverageAge(alivePeople)

    return {
      maleCount: maleCount,
      femaleCount: femaleCount,
      averageAge: averageAge
    }
  },

  getAllPeopleInFamily: function (familyPeople) {
    const spouses = familyPeople.spouses.filter(function (spouse) { return spouse._id !== undefined })
    const children = familyPeople.spouses
      .flatMap(function (spouse) { return spouse.children || [] })
      .flatMap(function (child) { return this.getAllPeopleInFamily(child) })

    return [familyPeople, spouses, children].flat()
  },

  getAverageAge: function (allPeople) {
    var birthDays = allPeople.map(function (people) { return people.birthDate })
      .filter(function (birthDate) { return !!birthDate })
      .map(function (birthDate) { return moment().diff(moment(birthDate), 'days') })

    if (birthDays.length === 0) return

    var averageBirthDays = birthDays.reduce(function (sum, value) { return sum + value }) / birthDays.length
    var averageBirthDate = moment().add(-averageBirthDays, 'days')
    return averageBirthDate.fromNow(true)
  }

})
