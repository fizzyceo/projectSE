const express = require("express");
const { validate } = require("express-validation");
const SiteHistController = require('../../controller/systemManagement/SiteHistController')
const { verifyToken } = require('../../middlewares/verifyToken')
const authorizeRoles = require('../../middlewares/authorizeRoles')
const Dtos = require('../../schema');
const clearCache = require('../../cachingSystem/middleware/clearCache')

const router = express.Router();


// authorizeRoles('client')
router.post('/create',clearCache("site"), SiteHistController.createSiteHistory)
router.post('/get', SiteHistController.getSitesHistory)
router.get('/get/:id', SiteHistController.getSiteHistory)
// router.put('/update/:id', clearCache("site"),SiteHistController.updateSite)
router.delete('/delete/:id',clearCache("site"),  SiteHistController.deleteSiteHistory)

module.exports = router;
