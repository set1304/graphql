const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const directorSchema = new Schema({
    name: String,
    age: Number,
})


module.exports = model('Director', directorSchema)