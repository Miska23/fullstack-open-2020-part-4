const User = require('../models/User')

const initialUsers = [
  { username: 'Miska23',
    name: 'Miska Linden',
    password: 'salainen'
  },
  { username: 'Wille',
    name: 'Ville Linden',
    password: 'tosiSalainen'
  },
]

const usersInDatabase = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

//* tarkista jokainen element sen varalta että property ei ole undefined
//* funktio palauttaa true vain jos kaikkien elementtien property ei ole undefined
const isPropertyOfEveryElementNotUndefined = function(array, property) {
  return array.every(element => typeof(element[property]) !== 'undefined')
}

module.exports = {
  initialUsers,
  usersInDatabase,
  isPropertyOfEveryElementNotUndefined
}