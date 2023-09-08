const express = require('express')
const app = express()

app.use(express.json())

//TABLE FOR THE PERSONS DATA
let persons = [
    {
        "name": "äijä 1",
        "number": "+111 1111 11111",
        "id": 1
    },
    {
        "name": "äijä 2",
        "number": "+222 2222 22222",
        "id": 2
    },
    {
        "name": "äijä 3",
        "number": "+333 3333 33333",
        "id": 3
    },
    {
        "name": "äijä 4",
        "number": "+444 4444 44444",
        "id": 4
    },
    {
        "name": "äijä 5",
        "number": "+555 5555 55555",
        "id": 5
    },
    {
        "name": "äijä 6",
        "number": "+666 6666 66666",
        "id": 6
    },
    {
        "name": "äijä 7",
        "number": "+777 7777 77777",
        "id": 7
    }
]

//ROUTE 1: GET SERVER ROOT AND SHOW TEXT
app.get('/', (req, res) => {
    res.send('<h1>Hello there!</h1></br><p>As you can see, you have come to middle of nothingness.<br/><br/>If you want to get somewhere, I suggest you add for example "/api/persons" to the end of the URL...<p/>')
})

//ROUTE 2: GET ALL PERSONS DATA
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//ROUTE 3: GET INFO PAGE WITH TEXT
app.get('/info', (req, res) => {
    res.send(`Phonebook includes ${persons.length} contacts<br/><br/>${new Date().toString()}`)
})

//ROUTE 4: GET SINGLE CONTACT BY ID
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)

    const person = persons.find(person => person.id === id)
    console.log(person)

    //CONDITION 1: IF PERSON WITH GIVEN ID EXISTS RETURN IT
    if (person) {
        response.json(person)
    } 
    //CONDITION 2: IF PERSON WITH GIVEN ID DOESN'T EXIST SHOW ERROR
    else {
        response.status(404).end()
    }
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)