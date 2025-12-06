const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // nekhdou token men header
    let token = req.header('Authorization');
    
    // ken famaach token
    if (!token) {
      return res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource.' });
    }
     
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // nlwajou l’utilisateur fel base
    const user = await User.findById(decoded.userId);
    
    // ken utilisateur mch mawjoud
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable.' });
    }
    
    // nzidou les infos de l’utilisateur
    req.userId = user._id;
    req.user = user;
    next();
  
  } catch (error) {
    console.error('Erreur dans le middleware d\'authentification :', error);
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

module.exports = authMiddleware;
