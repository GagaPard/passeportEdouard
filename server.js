require('dotenv').config()  //Charge les variables d'environnement dans process.env pour pouvoir les utiliser dans le code

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/task')

const app = express()

app.use(bodyParser.json())  //On convertit le JSON des requêtes en objet JS

app.use('/', authRoutes)    //Les routes d'auth sont accessibles avec /
app.use('/tasks', taskRoutes)   //Les routes tasks doivent être précédées de /tasks

mongoose.connect('mongodb://localhost:27017/todolist')
  .then(() => {
    app.listen(3000, () => console.log('Server running on http://localhost:3000 I am american Bill Gates Kendrick Lamar Burger YIHA'))
  })
  .catch(console.error)
