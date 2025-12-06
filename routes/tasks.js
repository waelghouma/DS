const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/roleCheck');

router.use(authMiddleware);

router.get('/search', taskController.searchTasks);

router.post('/', taskController.createTask);

router.get('/', taskController.getAllTasks);

router.get('/:id', taskController.getTaskById);

router.delete('/:id', taskController.deleteTask);

router.put('/:id/assign', checkRole('manager'), taskController.assignTask);

module.exports = router;