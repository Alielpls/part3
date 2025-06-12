const express = require('express')
const app = express()

app.use(express.json())

const randID = () =>{
    // 250 is the max and persons.length is the min
    const max = 250
    const min = 1
    return String(Math.round(Math.random() * (max - min) - min))
}

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
    
    response.send(`<p> Phonebook has ${persons.length} numbers </p> <p> it's ${dateReq} </p>`)
})


app.get('/api/persons', (request, response) =>{
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) =>{
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if(person)
        response.json(person)
    else{
        response.status(404).json({
            error:"Person not found."
        })
    }
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

    const nameRequest = body.name
    const numberRequest = String(body.number)
    
    if(persons.find(p => p.name.toLowerCase() === nameRequest.toLowerCase())){
        response.status(400).json({
            error:"Name must be unique"
        }).end()
    }else{

        const person = {
            id: randID(),
            name: nameRequest,
            number: numberRequest
        }

        persons = persons.concat(person)
        response.status(204).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
})