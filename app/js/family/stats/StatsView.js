const StatsView = Marionette.View.extend({
  template: Handlebars.templates['stats.hbs'],

  templateContext: function () {
    const allPeople = this.getAllPeopleInFamily(this.model.toJSON())
    const peopleCount = allPeople.length
    const maleCount = allPeople.filter(function (people) { return people.gender === 'M' }).length
    const femaleCount = allPeople.filter(function (people) { return people.gender === 'F' }).length
    const alivePeople = allPeople.filter(function (people) { return !people.deathDate })
    const averageAge = this.getAverageAge(alivePeople)

    return {
      peopleCount,
      maleCount,
      femaleCount,
      averageAge
    }
  },

  getAllPeopleInFamily: function (familyPeople) {
    const that = this
    const spouses = familyPeople.spouses.filter(function (spouse) { return spouse._id !== undefined })
    const children = familyPeople.spouses
      .flatMap(function (spouse) { return spouse.children || [] })
      .flatMap(function (child) { return that.getAllPeopleInFamily(child) })

    return [familyPeople, spouses, children].flat()
  },

  getAverageAge: function (allPeople) {
    const birthDays = allPeople.map(function (people) { return people.birthDate })
      .filter(function (birthDate) { return !!birthDate })
      .map(function (birthDate) { return moment().diff(moment(birthDate), 'days') })

    if (birthDays.length === 0) return

    const averageBirthDays = birthDays.reduce(function (sum, value) { return sum + value }) / birthDays.length
    const averageBirthDate = moment().add(-averageBirthDays, 'days')
    return averageBirthDate.fromNow(true)
  }

})
