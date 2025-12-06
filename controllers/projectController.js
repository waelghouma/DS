const Project = require('../models/Project');

// Création mtaa projet jdid
exports.createProject = async (req, res) => {
  try {
    const { nom, description, statut } = req.body;

    // nchofo ken user authenticated wala la
    if (!req.userId) {
      return res.status(401).json({ 
        message: 'Erreur d’authentification',
        error: 'Identifiant utilisateur manquant' 
      });
    }
    //variable projectData bch tkhzen fiha les données mtaa projet
    const projectData = {
      nom,
      description,
      statut: statut || 'en cours',
      proprietaire: req.userId,
    };

    const project = new Project(projectData);
    await project.save();
    await project.populate('proprietaire', 'nom login role'); 
    
    res.status(201).json({
      message: 'Projet créé avec succès.',
      project
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erreur lors de la création du projet.', 
      error: error.message 
    });
  }
};

// bch nekhdho les projets kolhom
exports.getAllProjects = async (req, res) => {
  try {
    let query = {};
    
    // ken l’utilisateur mouch manager nwarriw ken les projets mta3ou
    if (req.user.role !== 'manager') {
      query.proprietaire = req.userId;
    }
    // njibou les projets
    const projects = await Project.find(query)
      .populate('proprietaire', 'nom login role')
      .sort({ dateCreation: -1 }); 
    
    res.json({
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erreur lors du chargement des projets.', 
      error: error.message 
    });
  }
};

// njibou projet b id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('proprietaire', 'nom login role');
    
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }
    
    // nchoufou l’autorisation
    if (req.user.role !== 'manager' && 
        project.proprietaire._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        message: 'Vous n’avez pas l’autorisation d’accéder à ce projet.' 
      });
    }
    
    res.json({ project });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erreur lors du chargement du projet.', 
      error: error.message 
    });
  }
};

// Mise à jour mtaa projet
exports.updateProject = async (req, res) => {
  try {
    const { nom, description, statut } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }
    
    // nchoufou l’autorisation
    if (req.user.role !== 'manager' && 
        project.proprietaire.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        message: 'Vous n’avez pas l’autorisation de modifier ce projet.' 
      });
    }
    
    // Mise à jour des champs
    if (nom) project.nom = nom;
    if (description) project.description = description;
    if (statut) project.statut = statut;
    
    await project.save();
    await project.populate('proprietaire', 'nom login role');
    
    res.json({
      message: 'Projet mis à jour avec succès.',
      project
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erreur lors de la mise à jour du projet.', 
      error: error.message 
    });
  }
};

// nfaskhou projet
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }
    
    // nchoufou l’autorisation
    if (req.user.role !== 'manager' && 
        project.proprietaire.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        message: 'Vous n’avez pas l’autorisation de supprimer ce projet.' 
      });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Projet supprimé avec succès.' });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erreur lors de la suppression du projet.', 
      error: error.message 
    });
  }
};

// Recherche mtaa projets
exports.searchProjects = async (req, res) => {
  try {
    const { nom, statut, sortBy } = req.query;
    let query = {};
    
    // ken l’utilisateur mouch manager nwarriw ken les projets mta3ou
    if (req.user.role !== 'manager') {
      query.proprietaire = req.userId;
    }
    
    // Filtres de recherche
    if (nom) {
      query.nom = { $regex: nom, $options: 'i' };
    }
    
    if (statut) {
      query.statut = statut;
    }
    
    // tri
    let sortOptions = { dateCreation: -1 };
    if (sortBy === 'nom') sortOptions = { nom: 1 };
    if (sortBy === 'statut') sortOptions = { statut: 1 };
    
    const projects = await Project.find(query)
      .populate('proprietaire', 'nom login role')
      .sort(sortOptions);
    
    res.json({
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erreur lors de la recherche.', 
      error: error.message 
    });
  }
};
