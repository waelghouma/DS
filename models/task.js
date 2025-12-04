const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  statut: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo'
  },
  deadline: {
    type: Date
  },
  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', 
    required: true
  },
  utilisateurAssigne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;