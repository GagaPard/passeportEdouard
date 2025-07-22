const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body  
  const passwordHash = await bcrypt.hash(password, 10)  //On hash le mdp (10 représente les tours de sel, une sécurité en plus qui empêche d'avoir les mêmes hash pour les mêmes mdps)

  try {
    const user = await User.create({ email, passwordHash })     //On crée le user
    res.status(201).json({ id: user._id, email: user.email })   //On envoie un 201 avec l'id et le mail (le mdp n'est JAMAIS renvoyé attention la tchim)
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' })  //Erreur classique 400 bref ça va l'équipe ?
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })    //On cherche un user avec le même mail que celui rentré dans le req par l'utilisateur

  if (!user) return res.status(401).json({ error: 'Invalid mail' })  //S'il trouve pas erreur 401 tqt bb tu connais

  const isMatch = await bcrypt.compare(password, user.passwordHash)     //Si il trouve, on hash son mdp et on compare avec celui enregistré dans la bdd
  if (!isMatch) return res.status(401).json({ error: 'Invalid password' })   //S'il trouve pas erreur 401 tqt bb tu connais mdrrr ça se répète ou quoi ??????

  const token = jwt.sign(   //On lui créé le token
    { id: user._id, email: user.email },    //Avec l'id et le mail (toujours pas de mdp malheureux)
    process.env.JWT_SECRET || 'secret',     //On utilise la clé secrète du .env
    { expiresIn: '7d' }     //On met une date d'expiration (ici 7 jours)
  )

  res.json({ token })   //On envoie le token en réponse pour le stocker chez le client
})

router.post('/user', async (req, res) => {
  const users = await User.find({}, 'email')
  res.json(users)
})

router.get('/user', async (req, res) => {
  res.send('Public user endpoint')
})

module.exports = router