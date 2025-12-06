const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);


router.get('/search', projectController.searchProjects);

router.post('/', projectController.createProject);

router.get('/', projectController.getAllProjects);

router.get('/:id', projectController.getProjectById);

router.put('/:id', projectController.updateProject);

router.delete('/:id', projectController.deleteProject);

module.exports = router;