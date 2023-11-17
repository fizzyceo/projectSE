const uploadImageService = require('../service/uploadImageService')
const tryCatchWrapper = require('../helpers/tryCatchWrapper');
const { formatSuccessResponse } = require('../helpers/formatResponse')


const uploadImage = tryCatchWrapper(async (req, res, next) => {
    
    const data = req.newImageUrls;
    const result = await uploadImageService.uploadImage(data);
    return res.status(201).json(formatSuccessResponse(result, req));
});


module.exports = {
    uploadImage
}
