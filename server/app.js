const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const Movies = require('./models/director')

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

async function run() {
    try {
        await mongoose.connect('mongodb+srv://admin:admin@cluster0-j8hdr.mongodb.net/db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
         })
        app.listen(3000, (e) => {
            if(e) console.log('error', e);
            console.log("server is running");
        });
    } catch (e){
        console.log('error', e)
    }
}

run()