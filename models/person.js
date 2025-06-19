const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

//const password = process.argv[2]
const url = process.env.MONGODB_URI
mongoose.connect(url).then(
  () => {
    console.log('connected!')
  }
).catch(
  error => {
    console.log('error connecting', error.message)
  }
)

const personSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true,
    minLength: 3
  },
  number:{
    type:String,
    required:true,
    minLength:8,
    validate:{
      validator: (v) => {
        return /^\d{2,3}-\d{4,}/.test(v)
      },
      message: p => `${p.value} is not a phone number!`
    }
  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)