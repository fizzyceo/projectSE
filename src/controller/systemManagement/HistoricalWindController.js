const HistWindService= require('../../service/systemManagement/HistoricalWindService')
const tryCatchWrapper = require('../../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../../helpers/formatResponse')

//#region staffManagement

const createHistoricalWind = tryCatchWrapper(async (req, res, next) => {
    const data = req.body;
    const result = await HistWindService.createHistWind( data);
    return res.status(201).json(formatSuccessResponse(result,req));
});

const updateHistoricalWind = tryCatchWrapper(async (req, res, next) => { 
    const result = await HistWindService.updateHistoricalWind(req.params.id, req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getHistoricalWind = tryCatchWrapper(async (req, res, next) => { 
    const result = await HistWindService.getHistoricalWind(req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})
const getLatestWind= tryCatchWrapper(async (req, res, next) => { 
    const result = await HistWindService.getLatestWind(req.params.devid);
    return res.status(200).json(formatSuccessResponse(result,req));
})


const getOneHistoricalWind= tryCatchWrapper(async (req, res, next) => { 
    const result = await HistWindService.getOneHistoricalWind( req.params.devid);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const DeleteHistoricalWind = tryCatchWrapper(async (req, res, next) => { 
    const result = await HistWindService.DeleteHistoricalWind( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})


//#endregion staffManagement



module.exports = {
    createHistoricalWind,
    getHistoricalWind,
    getOneHistoricalWind,
    getLatestWind,
    DeleteHistoricalWind,
    updateHistoricalWind,   
}