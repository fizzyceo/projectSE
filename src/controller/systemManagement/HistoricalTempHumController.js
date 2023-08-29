const HistTempService= require('../../service/systemManagement/HistoricalTempHumService')
const tryCatchWrapper = require('../../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../../helpers/formatResponse')

//#region staffManagement

const createHistoricalTemphum = tryCatchWrapper(async (req, res, next) => {
    const data = req.body;
    const result = await HistTempService.createHistTemp( data);
    return res.status(201).json(formatSuccessResponse(result,req));
});

const updateHistoricalTemphum = tryCatchWrapper(async (req, res, next) => { 
    const result = await HistTempService.updateHistoricalTemphum(req.params.id, req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getHistoricalTemphum = tryCatchWrapper(async (req, res, next) => { 
    const result = await HistTempService.getHistoricalTemphum(req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getOneHistoricalTemphum= tryCatchWrapper(async (req, res, next) => { 
    const result = await HistTempService.getOneHistoricalTemphum( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const DeleteHistoricalTemphum = tryCatchWrapper(async (req, res, next) => { 
    const result = await HistTempService.DeleteHistoricalTemphum( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})


//#endregion staffManagement



module.exports = {
    createHistoricalTemphum,
    getHistoricalTemphum,
    getOneHistoricalTemphum,
    DeleteHistoricalTemphum,
    updateHistoricalTemphum,   
}