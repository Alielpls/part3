const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://saruguimontesclaro:${password}@cluster0.if7k6pr.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)


// adds a new person to the phonebook
if(process.argv.length === 5){
    
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    person.save().then(result => {
        console.log('added ', result.name, ' number ', result.number, ' to the phonebook')
        mongoose.connection.close()
    })

}else
// display all entries 
if(process.argv.length === 3){
    console.log('Phonebook:')
    Person.find({}).then(result =>{
        result.forEach(p =>{
            console.log(p.name, p.number)
        })
        mongoose.connection.close()
    })
}else{
    console.log('insert the correct parameters')
    process.exit(1)
}

