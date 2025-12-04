const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/GestionDeProjets",);
    console.log('✅ MongoDB connectée avec succès');
  } catch (err) {
    console.error('❌ Erreur de connexion à MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;