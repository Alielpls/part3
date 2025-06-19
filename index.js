const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

morgan.token('data', (request, response) =>{
    if(request.method === 'POST')
        return JSON.stringify(request.body)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time[3] ms :data'))
// app.use(cors())


// const randID = () =>{
//     const max = 250
//     const min = 1
//     return String(Math.round(Math.random() * (max - min) - min))
// }

let persons =
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) =>{
    const dateReq = new Date().toString()
    
    response.send(`<p> Phonebook has ${persons.length} numbers </p> 
        <p> it's ${dateReq} </p>`)
})

app.get('/api/persons', (request, response) =>{
    Person.find({}).then(result =>{
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response) =>{
    const id = request.params.id
    
    Person.findById(id).then(person =>{
        if(person)
            response.json(person)
        else{
            response.status(404).json({
                error:"Person not found."
            })
        }
    }).catch(error =>{
        console.log(error)
        response.status(400).send({error: 'malformatted id!'})
    })
    
    //const person = persons.find(p => p.id === id)
    // if(person)
    //     response.json(person)
    // else{
    //     response.status(404).json({
    //         error:"Person not found."
    //     })
    // }
})

app.delete('/api/persons/:id', (request, response) =>{
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    
    response.status(204).end()
})

app.post('/api/persons', (request, response) =>{

    const body = request.body

    if(!body.name || !body.number){
        response.status(400).json({
            error:"Person must have name and number"
        }).end()
    }
    
    const person = new Person({
        //id: randID(),
        name: body.name,
        number: String(body.number)
    })
    
    person.save().then(savedPerson =>{
        response.status(201).json(savedPerson)
    })
    // persons = persons.concat(person)
    //response.status(201).json(person).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
})