const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization    //On lit l'en-tête où il y a le token (Authorisation : Bearer <le token>)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' })   //S'il y a pas de token hop petite erreur oklm
    }

    const token = authHeader.split(' ')[1]  //On récupère que le token en enlevant le bearer de ses morts

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret')   //On vérifie le token avec la clé secrète dans le .env
        req.user = { id: payload.id, email: payload.email }     //On injecte les données dans dans les requêtes pour autoriser l'accès
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' })   //Erreur si pas le bon token
    }
}