const express = require('express');
const router = express.Router();
const {
  getMyManager,
  deleteOwnProfile
} = require('../controllers/workerController');
const { protect, authorizeRoles } = require('../middleware/auth');

// Only accessible by logged-in workers
router.use(protect, authorizeRoles('worker'));

router.get('/manager', getMyManager);           // Get this worker's manager
router.delete('/delete', deleteOwnProfile);     // Delete own profile

module.exports = router;