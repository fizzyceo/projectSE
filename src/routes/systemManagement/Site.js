const express = require("express");
const { validate } = require("express-validation");
const SitesController = require('../../controller/systemManagement/SitesController')
const { verifyToken } = require('../../middlewares/verifyToken')
const authorizeRoles = require('../../middlewares/authorizeRoles')
const Dtos = require('../../schema');
const clearCache = require('../../cachingSystem/middleware/clearCache')

const router = express.Router();


// authorizeRoles('client')
router.post('/create', SitesController.createSite)
router.get('/get', SitesController.getSites)
router.get('/get/:id', SitesController.getSite)
router.put('/update/:id', SitesController.updateSite)
router.delete('/delete/:id',  SitesController.deleteSite)

module.exports = router;
