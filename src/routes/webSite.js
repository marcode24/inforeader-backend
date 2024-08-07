const { Router } = require('express');
const {
  createWebSite,
  updateWebsites,
  getWebsites,
} = require('../controllers/webSite');

const router = Router();

router.get('/', getWebsites);
router.post('/', createWebSite);
router.get('/update', updateWebsites);

module.exports = router;
