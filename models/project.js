const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  statut: {
    type: String,
    enum: ['en cours', 'terminé', 'en pause'],
    default: 'en cours'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;