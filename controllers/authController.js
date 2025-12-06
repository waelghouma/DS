const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


//bch naamlou token JWT 
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d' 
  });
};

// Inscription mtaa utilisateur jdid
exports.register = async (req, res) => {
  try {
    const { nom, login, motDePasse, role } = req.body;
    
    // nchoufo ken login mawjouda wala la
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(400).json({ message: 'Ce login existe déjà.' });
    }

    // cryptage mtaa motDePasse
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Création mtaa utilisateur
    const user = new User({
      nom,
      login,
      motDePasse: hashedPassword,
      role: role || 'user' // role par defaut bch ykoun 'user'
    });
    
    await user.save();
    
    // Génération mtaa token
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erreur lors de la création du compte.', 
      error: error.message 
    });
  }
};

// login utilisateur
exports.login = async (req, res) => {
  try {
    const { login, motDePasse } = req.body;
    
    // nlwjo ala user bil login
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }
    
    // verifiw mot passe shiha wle la
    const isPasswordValid = await user.comparePassword(motDePasse);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }
    

    const token = generateToken(user._id);
    
    res.json({
      message: 'Connexion réussie.',
      token
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erreur lors de la connexion.', 
      error: error.message 
    });
  }
};

// nekdho les informations mtaa user connecté
exports.getProfile = async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    res.status(400).json({ 
      message: 'Impossible de récupérer les informations du profil.', 
      error: error.message 
    });
  }
};
