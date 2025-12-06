const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

//routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');


app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 



app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Gestion de Projets et Tâches', 
    status: 'En ligne' 
  });
});


app.use('/api/auth', authRoutes);       // Routes mtaa l'authentification
app.use('/api/projects', projectRoutes); // Routes mtaa les projets
app.use('/api/tasks', taskRoutes);       // Routes mtaa les taches



// Connexion ll base MongoDB

const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connecté avec succès");
  } catch (err) {
    console.error("❌ Échec de la connexion à MongoDB :", err);
    process.exit(1); 
  }
};
connect();



// Lanciw serveur

app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
