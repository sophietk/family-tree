const CelebrationsView = Marionette.View.extend({
  template: Handlebars.templates['celebrations.hbs'],

  templateContext: function () {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const allPeople = this.getAllPeopleInFamily(this.model.toJSON())
    const peopleWithUpcomingBirthdays = allPeople
      .filter(function (people) {
        if (!people.birthDate || people.deathDate) return false

        const birthday = new Date(people.birthDate)
        const nextBirthday = new Date(
          today.getFullYear(),
          birthday.getMonth(),
          birthday.getDate()
        )

        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1)
        }

        const diffInDays = Math.ceil(
          (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )

        people.nextBirthday = nextBirthday
        people.age = people.age || 0
        people.nextAge = nextBirthday.getTime() === today.getTime() ? people.age : people.age + 1

        return diffInDays <= 14
      })
      .sort(function (peopleA, peopleB) {
        return peopleA.nextBirthday.getTime() - peopleB.nextBirthday.getTime()
      })

    return {
      peopleWithUpcomingBirthdays: peopleWithUpcomingBirthdays
    }
  },

  getAllPeopleInFamily: function (familyPeople) {
    const that = this
    const spouses = familyPeople.spouses.filter(function (spouse) { return spouse._id !== undefined })
    const children = familyPeople.spouses
      .flatMap(function (spouse) { return spouse.children || [] })
      .flatMap(function (child) { return that.getAllPeopleInFamily(child) })

    return [familyPeople, spouses, children].flat()
  }

})
