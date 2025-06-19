const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

morgan.token('data', (request) => {
  if(request.method === 'POST')
    return JSON.stringify(request.body)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time[3] ms :data'))
// app.use(cors())

const errorHandler = (error,request,response,next) => {
  console.log(error)

  if(error.name === 'CastError'){
    return response.status(400).send({ error:'Malformatted id' })
  } else
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }

  next(error)
}


//let persons =
//[
//]

app.get('/info', (request, response) => {
  const dateReq = new Date().toString()

  Person.find({}).then(result => {
    response.send(`<p> Phonebook has ${result.length} numbers </p> 
            <p> it's ${dateReq} </p>`)
  })


})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id).then(person => {
    if(person)
      response.json(person)
    else{
      response.status(404).json({
        error:'Person not found.'
      })
    }
  }).catch(error => next(error))

  //const person = persons.find(p => p.id === id)
  // if(person)
  //     response.json(person)
  // else{
  //     response.status(404).json({
  //         error:"Person not found."
  //     })
  // }
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))

  //persons = persons.filter(p => p.id !== id)
  //response.status(204).end()
})

app.post('/api/persons', (request, response, next) => {

  const body = request.body

  if(!body.name || !body.number){
    response.status(400).json({
      error:'Person must have name and number'
    }).end()
  }

  const person = new Person({
    //id: randID(),
    name: body.name,
    number: String(body.number)
  })

  person.save().then(savedPerson => {
    response.status(201).json(savedPerson)
  })
    .catch(error => next(error))

  // persons = persons.concat(person)
  //response.status(201).json(person).end()
})

app.put('/api/persons/:id', (request, response, next) => {

  const id = request.params.id
  const { name, number } = request.body

  Person.findById(id).then(p => {
    if(p){
      p.name = name
      p.number = number


      return p.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    }else{
      return response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`)
})