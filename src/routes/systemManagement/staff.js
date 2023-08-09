const express = require("express");
const { validate } = require("express-validation");
const staffController = require('../../controller/systemManagement/staffController')
const { verifyToken } = require('../../middlewares/verifyToken')
const authorizeRoles = require('../../middlewares/authorizeRoles')
const Dtos = require('../../schema');

const router = express.Router();

//#region staff
// authorizeRoles('client')
router.post('/create/staff', validate(Dtos.createStaffDto), verifyToken, staffController.createStaffUser)
router.post('/get/staffs', validate(Dtos.getStaffsDto), verifyToken, staffController.getStaffUsers)
router.get('/get/staff/:id', validate(Dtos.getStaffDto), verifyToken, staffController.getStaffUser)
router.put('/update/staff/:id', validate(Dtos.updateStaffDto), verifyToken, staffController.updateStaffUser)
router.put('/delete/staff/:id', validate(Dtos.deleteStaffDto), verifyToken, staffController.deleteStaffUser)

// getStaffVenues
// suspend and activate
router.put('/suspend/staff/:id', validate(Dtos.suspendStaffDto), verifyToken, staffController.suspendStaffUser)
router.put('/activate/staff/:id', validate(Dtos.activateStaffDto), verifyToken, staffController.activateStaffUser)
//#endregion staff



module.exports = router;
