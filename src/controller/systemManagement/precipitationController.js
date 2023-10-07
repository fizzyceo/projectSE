
const PrecipitationService = require('../../service/systemManagement/PrecipitationService')
const tryCatchWrapper = require('../../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../../helpers/formatResponse')


const getPrecipitation = tryCatchWrapper(async (req, res, next) => { 
    const result = await PrecipitationService.get( req.body);
    return res.status(200).json(formatSuccessResponse(result,req));
})


module.exports ={
    getPrecipitation
}