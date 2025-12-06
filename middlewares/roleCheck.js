const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    
    // nchoufou ken utlisateur authentifié wle
    if (!req.user) {
      return res.status(401).json({ message: 'Non autorisé, utilisateur introuvable' });
    }
    
    // nchoufou ken role mtaa utilisateur mawjoud fel roles autorisés wle
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Vous n’avez pas l’autorisation pour effectuer cette action',
        roleRequis: allowedRoles,
        votreRole: req.user.role
      });
    }
    
    next();
  };
};

module.exports = checkRole;
