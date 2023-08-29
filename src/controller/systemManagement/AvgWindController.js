const AvgWindService= require('../../service/systemManagement/AvgWindService')
const tryCatchWrapper = require('../../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../../helpers/formatResponse')

//#region staffManagement

const createAvgWind = tryCatchWrapper(async (req, res, next) => {
    const data = req.body;
    const result = await AvgWindService.createAvgWind(data);
    return res.status(201).json(formatSuccessResponse(result,req));
});

const updateAvgWind = tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgWindService.updateAvgWind(req.params.id, req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})
const updateAvgWindByDate = tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgWindService.updateAvgWindByDate(req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getAvgWind = tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgWindService.getAvgWind();
    return res.status(200).json(formatSuccessResponse(result,req));
})
const getAvgWindBetweenDates = tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgWindService.getAvgWindBetweenDates(req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getOneAvgWind= tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgWindService.getOneAvgWind( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const DeleteAvgWind = tryCatchWrapper(async (req, res, next) => { 
    const result = await AvgWindService.DeleteAvgWind( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})


//#endregion staffManagement



module.exports = {
    createAvgWind,
    getAvgWind,
    getAvgWindBetweenDates,
    updateAvgWindByDate,
    getOneAvgWind,
    DeleteAvgWind,
    updateAvgWind,   
}