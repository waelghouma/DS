const Task = require('../models/Task');
const Project = require('../models/Project');


// Création mtaa tache jdid
exports.createTask = async (req, res) => {
  try {
    const { titre, description, statut, deadline, projet } = req.body;
    
    // nchoufou ken projet mawjoud
    const projectExists = await Project.findById(projet);
    if (!projectExists) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }
    
    // nchoufou l’autorisation
    if (req.user.role !== 'manager' &&
        projectExists.proprietaire.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: 'Vous n’avez pas l’autorisation d’ajouter une tache à ce projet.'
      });
    }
    
    // Creatation mtaa tache
    const task = new Task({
      titre,
      description,
      statut,
      deadline,
      projet
    });
    
    await task.save();
    await task.populate([
      { path: 'projet', select: 'nom statut' },
      { path: 'utilisateurAssigne', select: 'nom login' }
    ]);
    
    res.status(201).json({
      message: 'Tache créée avec succès.',
      task
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors de la création de la tache.',
      error: error.message
    });
  }
};


// njibou les taches lkol
exports.getAllTasks = async (req, res) => {
  try {
    let query = {};
    
    // ken l’utilisateur mouch manager nwarriw ken les projets mta3ou
    if (req.user.role !== 'manager') {
      const userProjects = await Project.find({ proprietaire: req.userId });
      const projectIds = userProjects.map(p => p._id);
      query.projet = { $in: projectIds };
    }
    
    const tasks = await Task.find(query)
      .populate('projet', 'nom statut')
      .populate('utilisateurAssigne', 'nom login')
      .sort({ dateCreation: -1 });
    
    res.json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors du chargement des tâches.',
      error: error.message
    });
  }
};


// njibou tache b id
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projet', 'nom statut proprietaire')
      .populate('utilisateurAssigne', 'nom login');
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable.' });
    }
    
    // nchoufou l’autorisation
    if (req.user.role !== 'manager' &&
        task.projet.proprietaire.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: 'Vous n’avez pas l’autorisation de modifier cette tache.'
      });
    }
    
    res.json({ task });
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors du chargement de la tache.',
      error: error.message
    });
  }
};


// Mise à jour mtaa tache
exports.updateTask = async (req, res) => {
  try {
    const { titre, description, statut, deadline } = req.body;
    
    const task = await Task.findById(req.params.id)
      .populate('projet');
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable.' });
    }
    
   // nchoufou l’autorisation
    if (req.user.role !== 'manager' &&
        task.projet.proprietaire.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: 'Vous n’avez pas l’autorisation de modifier cette tâche.'
      });
    }
    
    // mise à jour des champs
    if (titre) task.titre = titre;
    if (description) task.description = description;
    if (statut) task.statut = statut;
    if (deadline) task.deadline = deadline;
    
    await task.save();

    res.json({
      message: 'Tache mise à jour avec succès.',
      task
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors de la mise à jour.',
      error: error.message
    });
  }
};


// nfaskhou tache
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projet');
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable.' });
    }
    
    // nchoufou l’autorisation
    if (req.user.role !== 'manager' &&
        task.projet.proprietaire.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: 'Vous n’avez pas l’autorisation de supprimer cette tâche.'
      });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Tâche supprimée avec succès.' });
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors de la suppression.',
      error: error.message
    });
  }
};


// Assigner une tache ll utilisateur
exports.assignTask = async (req, res) => {
  try {
    const { utilisateurId } = req.body;
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable.' });
    }
    
    task.utilisateurAssigne = utilisateurId;
    await task.save();
    
    res.json({
      message: 'Tâche assignée avec succès.',
      task
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors de l’assignation.',
      error: error.message
    });
  }
};


// Recherche mtaa taches
exports.searchTasks = async (req, res) => {
  try {
    const { statut, projet, utilisateur, sortBy } = req.query;
    let query = {};
    
    // ken l’utilisateur mouch manager nwarriw ken les projets mta3ou
    if (req.user.role !== 'manager') {
      const userProjects = await Project.find({ proprietaire: req.userId });
      const projectIds = userProjects.map(p => p._id);
      query.projet = { $in: projectIds };
    }
    
    // Filters
    if (statut) query.statut = statut;
    if (projet) query.projet = projet;
    if (utilisateur) query.utilisateurAssigne = utilisateur;
    
    // tri
    let sortOptions = { dateCreation: -1 };
    if (sortBy === 'deadline') sortOptions = { deadline: 1 };
    if (sortBy === 'statut') sortOptions = { statut: 1 };
    if (sortBy === 'titre') sortOptions = { titre: 1 };
    
    const tasks = await Task.find(query)
      .populate('projet', 'nom statut')
      .populate('utilisateurAssigne', 'nom login')
      .sort(sortOptions);
    
    res.json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors de la recherche.',
      error: error.message
    });
  }
};
