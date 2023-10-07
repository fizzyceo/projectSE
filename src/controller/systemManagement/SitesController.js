const siteService = require('../../service/systemManagement/SiteService')
const tryCatchWrapper = require('../../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../../helpers/formatResponse')

//#region staffManagement

const createSite = tryCatchWrapper(async (req, res, next) => {
    const data = req.body;
    const result = await siteService.createSite( data);
    return res.status(201).json(formatSuccessResponse(result,req));
});

const updateSite = tryCatchWrapper(async (req, res, next) => { 
    const result = await siteService.updateSite( req.params.id, req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})
const monitorSites =  tryCatchWrapper(async (req, res, next) => { 
    const result = await siteService.monitor();
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getSites = tryCatchWrapper(async (req, res, next) => { 
    const result = await siteService.getSites(req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const getSite = tryCatchWrapper(async (req, res, next) => { 
    const result = await siteService.getSite( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})

const deleteSite = tryCatchWrapper(async (req, res, next) => { 
    const result = await siteService.deleteSite( req.params.id);
    return res.status(200).json(formatSuccessResponse(result,req));
})


//#endregion staffManagement



module.exports = {
    createSite,
    getSites,
    getSite,
    monitorSites,
    deleteSite,
    updateSite,
    
}