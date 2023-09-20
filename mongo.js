const mongoose = require('mongoose')

//CONDITION 1: IF GIVEN COMMAND HAS LESS THAN 3 WORDS
if (process.argv.length<3) {
  console.log('Add password to terminal after command')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.qpggenh.mongodb.net/Contacts?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

//MAKE MONGODB DOCUMENT MODEL
const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

//CONDITION 2: IF GIVEN COMMAND HAS 5 WORDS
if (process.argv.length === 5) {
  //MAKE NEW OBJECT
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
  })

  contact.save().then(result => {
    //console.log(result)
    console.log(`Added ${result.name} with number ${result.number} to the phonebook`)
    mongoose.connection.close()
  })
}


//CONDITION 3: IF GIVEN COMMAND HAS 3 WORDS
if (process.argv.length === 3) {
  Contact.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(contact => {
      console.log(contact.name + ' ' + contact.number)
    })
    mongoose.connection.close()
  })
}