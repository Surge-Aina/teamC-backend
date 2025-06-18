const express = require('express');
const router = express.Router();
const {
  getWorkersUnderManager,
  deleteWorker,
  getActiveUsers,
  addWorker
} = require('../controllers/managerController');
const { protect, authorizeRoles } = require('../middleware/auth');
const trackActivity = require('../middleware/trackActivity'); 

router.use(protect, authorizeRoles('manager'), trackActivity); 

router.get('/workers', getWorkersUnderManager);
router.delete('/workers/:id', deleteWorker);
router.get('/active', getActiveUsers);
router.post('/add-worker', addWorker);

module.exports = router;