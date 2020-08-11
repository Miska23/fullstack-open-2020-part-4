const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  passwordHash: String,
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() //! _id-olio merkkijonoksi ja se olion.id:ksi
    delete returnedObject._id //! ominaisuuden poisto
    delete returnedObject.__v
    delete returnedObject.passwordHash //* ei palauteta hashia
  }
})

module.exports = mongoose.model('User', userSchema)
