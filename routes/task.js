const express = require('express')
const Task = require('../models/Task')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, async (req, res) => { //On utilise le middleware auth pour protéger l'entrée des gens non connectés
  const tasks = await Task.find({ owner: req.user.id }) //On trouve les tasks du user en utilisant son id
  res.json(tasks)
})

router.post('/', auth, async (req, res) => {
  const { text } = req.body
  const task = await Task.create({ text, owner: req.user.id })  //On créé la task en mettant en arg le text rentré et l'id de l'user
  res.status(201).json(task)
})

router.put('/:id', auth, async (req, res) => {
  const { text, done } = req.body
  const updated = await Task.findOneAndUpdate(  
    { _id: req.params.id, owner: req.user.id }, //On cherche la task avec le bon id et le bon owner
    { text, done }, //On modifie le label et/ou le done
    { new: true }   //Permet de renvoyer la task mise à jour
  )

  if (!updated) return res.status(404).json({ message: 'Task not found' })  //Si y a rien petite erreur des familles
  res.json(updated) //On envoie la réponse
})

router.delete('/:id', auth, async (req, res) => {
  const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })   //Idem qu'avant, on trouve et on tue
  if (!deleted) return res.status(404).json({ message: 'Task not found' })
  res.json({ message: 'Task deleted' })
})

module.exports = router

