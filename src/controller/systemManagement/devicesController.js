const deviceService = require('../../service/systemManagement/deviceService')
const tryCatchWrapper = require('../../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../../helpers/formatResponse')

//#region staffManagement

const createDevice = tryCatchWrapper(async (req, res, next) => {
    const data = req.body;
    const result = await deviceService.createDevice(req.user.id, data);
    return res.status(201).json(formatSuccessResponse(result,req));
});

const updateDevice = tryCatchWrapper(async (req, res, next) => { 
    const result = await deviceService.updateDevice(req.user.id, req.params.id, req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getDevices = tryCatchWrapper(async (req, res, next) => { 
    const result = await deviceService.getDevices(req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getDevice = tryCatchWrapper(async (req, res, next) => { 
    const result = await deviceService.getDevice( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const deleteDevice = tryCatchWrapper(async (req, res, next) => { 
    const result = await deviceService.deleteDevice(req.user.id, req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})


//#endregion staffManagement



module.exports = {
    createDevice,
    getDevices,
    getDevice,
    deleteDevice,
    updateDevice,
    
}