const WindTempService= require('../../service/systemManagement/WindTempService')
const tryCatchWrapper = require('../../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../../helpers/formatResponse')

//#region staffManagement

const createWindTemp = tryCatchWrapper(async (req, res, next) => {
    const data = req.body;
    const result = await WindTempService.createWindTemp( data);
    return res.status(201).json(formatSuccessResponse(result,req));
});

const updateWindTemp = tryCatchWrapper(async (req, res, next) => { 
    const result = await WindTempService.updateWindTemp(req.params.id, req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getWindTemp = tryCatchWrapper(async (req, res, next) => { 
    const result = await WindTempService.getWindTemp(req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getOneWindTemp= tryCatchWrapper(async (req, res, next) => { 
    const result = await WindTempService.getOneWindTemp( req.params.devid);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const DeleteWindTemp = tryCatchWrapper(async (req, res, next) => { 
    const result = await WindTempService.DeleteWindTemp( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})


//#endregion staffManagement



module.exports = {
    createWindTemp,
    getWindTemp,
    getOneWindTemp,
    
    DeleteWindTemp,
    updateWindTemp,   
}