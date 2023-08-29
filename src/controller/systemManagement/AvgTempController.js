const AvgTempService= require('../../service/systemManagement/AvgTempService')
const tryCatchWrapper = require('../../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../../helpers/formatResponse')

//#region staffManagement

const createAvgTemp = tryCatchWrapper(async (req, res, next) => {
    const data = req.body;
    const result = await AvgTempService.createAvgTemp(data);
    return res.status(201).json(formatSuccessResponse(result,req));
});

const updateAvgTemp = tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgTempService.updateAvgTemp(req.params.id, req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})
const updateAvgTempByDate = tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgTempService.updateAvgTempByDate(req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getAvgTemp = tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgTempService.getAvgTemp();
    return res.status(200).json(formatSuccessResponse(result,req));
})
const getAvgTempBetweenDates = tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgTempService.getAvgTempBetweenDates(req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})
const getOneAvgTemp= tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgTempService.getOneAvgTemp( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const DeleteAvgTemp = tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgTempService.DeleteAvgTemp( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})


//#endregion staffManagement



module.exports = {
    createAvgTemp,
    getAvgTemp,
    getAvgTempBetweenDates,
    updateAvgTempByDate,
    getOneAvgTemp,
    DeleteAvgTemp,
    updateAvgTemp,   
}