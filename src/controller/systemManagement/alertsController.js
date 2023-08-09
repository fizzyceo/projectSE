const alertService = require('../../service/systemManagement/alertService')
const tryCatchWrapper = require('../../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../../helpers/formatResponse')

//#region staffManagement

const createAlert = tryCatchWrapper(async (req, res, next) => {
    const data = req.body;
    const result = await alertService.createAlert(req.user.id, data);
    return res.status(201).json(formatSuccessResponse(result,req));
});

const updateAlert = tryCatchWrapper(async (req, res, next) => { 
    const result = await alertService.updateAlert(req.user.id, req.params.id, req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getAlerts = tryCatchWrapper(async (req, res, next) => { 
    const result = await alertService.getAlerts( req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getAlert = tryCatchWrapper(async (req, res, next) => { 
    const result = await alertService.getAlert( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const deleteAlert = tryCatchWrapper(async (req, res, next) => { 
    const result = await alertService.deleteAlert(req.user.id,req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})


//#endregion staffManagement



module.exports = {
    createAlert,
    getAlerts,
    getAlert,
    deleteAlert,
    updateAlert,
    
}