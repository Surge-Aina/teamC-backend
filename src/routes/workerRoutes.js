const express = require('express');
const router = express.Router();
const {
  getMyManager,
  deleteOwnProfile
} = require('../controllers/workerController');
const { protect, authorizeRoles } = require('../middleware/auth');
const trackActivity = require('../middleware/trackActivity'); 

router.use(protect, authorizeRoles('worker'), trackActivity); 

router.get('/manager', getMyManager);
router.delete('/delete', deleteOwnProfile);

module.exports = router;