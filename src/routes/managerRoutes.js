const express = require('express');
const router = express.Router();
const {
  getWorkersUnderManager,
  deleteWorker,
  getActiveUsers,
  addWorker
} = require('../controllers/managerController');
const { protect, authorizeRoles } = require('../middleware/auth');

// Only accessible by logged-in managers
router.use(protect, authorizeRoles('manager'));

router.get('/workers', getWorkersUnderManager);       // Get workers under this manager
router.delete('/workers/:id', deleteWorker);          // Delete a worker (must be under this manager)
router.get('/active', getActiveUsers);                // Get active workers and managers
router.post('/add-worker', addWorker);                // Add a new worker under this manager

module.exports = router;