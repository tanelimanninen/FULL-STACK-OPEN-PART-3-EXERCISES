const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to given url...')
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

//MAKE MONGODB DOCUMENT MODEL
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'Contact has to have a name']
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2}-\d{5,}/.test(v) || /\d{3}-\d{4,}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    minlength: 8,
    required: [true, 'Contact has to have a number']
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)