const staffService = require('../../service/systemManagement/staffService')
const tryCatchWrapper = require('../../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../../helpers/formatResponse')

//#region staffManagement

const createStaffUser = tryCatchWrapper(async (req, res, next) => {
    const data = req.body;
    const result = await staffService.createStaffUser(data);
    return res.status(201).json(formatSuccessResponse(result, req));
});

const updateStaffUser = tryCatchWrapper(async (req, res, next) => {
    const data = req.body;
    const result = await staffService.updateStaffUser(req.params.id, data);
    return res.status(201).json(formatSuccessResponse(result, req));
});

const getStaffUsers = tryCatchWrapper(async (req, res, next) => {
    const result = await staffService.getStaffUsers(req.body);
    return res.status(200).json(formatSuccessResponse(result, req));
});

const getStaffUser = tryCatchWrapper(async (req, res, next) => {
    const result = await staffService.getStaffUser(req.params.id);
    return res.status(200).json(formatSuccessResponse(result, req));
});

const deleteStaffUser = tryCatchWrapper(async (req, res, next) => {
    const result = await staffService.deleteStaffUser(req.params.id);
    return res.status(200).json(formatSuccessResponse(result, req));
});

const suspendStaffUser = tryCatchWrapper(async (req, res, next) => {
    const result = await staffService.suspendStaffUser(req.params.id);
    return res.status(200).json(formatSuccessResponse(result, req));
});

const activateStaffUser = tryCatchWrapper(async (req, res, next) => {
    const result = await staffService.activateStaffUser(req.params.id);
    return res.status(200).json(formatSuccessResponse(result, req));
});

// forget password




//#endregion staffManagement



module.exports = {
    createStaffUser,
    getStaffUsers,
    getStaffUser,
    deleteStaffUser,
    suspendStaffUser,
    activateStaffUser,
    updateStaffUser,
}