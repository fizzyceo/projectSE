const SiteHistoryService = require('../../service/systemManagement/SiteHistoryService')
const tryCatchWrapper = require('../../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../../helpers/formatResponse')

//#region staffManagement

const createSiteHistory = tryCatchWrapper(async (req, res, next) => {
    const data = req.body;
    const result = await SiteHistoryService.create( data);
    return res.status(201).json(formatSuccessResponse(result,req));
});

// const updateSiteHistory = tryCatchWrapper(async (req, res, next) => { 
//     const result = await SiteHistoryService.updateSite( req.params.id, req.body);
//     return res.status(200).json(formatSuccessResponse(result,req));
// })

const getSitesHistory = tryCatchWrapper(async (req, res, next) => { 
    const result = await SiteHistoryService.get(req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getSiteHistory = tryCatchWrapper(async (req, res, next) => { 
    const result = await SiteHistoryService.getOne( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const deleteSiteHistory = tryCatchWrapper(async (req, res, next) => { 
    const result = await SiteHistoryService.deleteHistSite( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})


//#endregion staffManagement



module.exports = {
    createSiteHistory,
    getSitesHistory,
    getSiteHistory,
    deleteSiteHistory,
    // updateSite,
    
}