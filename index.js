require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Contact = require('./models/contact')


//MIDDLEWARE 1: CUSTOM TOKEN FOR POST REQUESTS: LOG REQUEST.BODY TO THE CONSOLE
morgan.token('req-body', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }

  return '-'
})

//MIDDLEWARE 2: CATCH ERRORS AND INFORM THE USER
const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  console.log(error.name)

  //CONDITION 1: GIVEN ID CAN'T BE FOUND
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  //CONDITION 2: IF NEW CONTACT'S VALIDATION HAS ERRORS
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :req-body'))



//ROUTE 1: GET ALL PERSONS DATA
app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

//ROUTE 2: GET INFO PAGE WITH TEXT (CURRENTLY BROKEN)
app.get('/info', (request, response) => {
  Contact.find({}).then(contacts => {
    response.send(`Phonebook includes ${contacts.length} contacts<br/><br/>${new Date().toString()}`)
  })
})

//ROUTE 3: GET SINGLE CONTACT BY ID
app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//ROUTE 4: DELETE CONTACT BY GIVEN ID
app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


//ROUTE 5: ADD NEW CONTACT
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  //CONDITION 1: IF NAME OR NUMBER VALUE EMPTY
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Can not add empty values'
    })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact.save()
    .then(savedContact => {
      response.json(savedContact)
    })
    .catch(error => next(error))
})

//ROUTE 6: UPDATE EXISTING DATA
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact)
      //console.log(updatedContact)
    })
    .catch(error => next(error))
})

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})