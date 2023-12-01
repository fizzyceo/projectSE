
const {mapLanguage} = require('./mapLanguage')

const formatSuccessResponse = (result,req=null) => {
    if (req) {
        const lang = req.get("Accept-Language") || req.get("accept-language")|| "en"
        result.message = mapLanguage(lang, 'Success')
    } else {
        result.message = 'Success'
    }
    result.result=true
    return result
}
const formatErrorResponse = (message, errors = []) => {
    return {
        result: false,
        message,
        errors,
        data: null
    };
}

module.exports = {
    formatSuccessResponse,
    formatErrorResponse
}