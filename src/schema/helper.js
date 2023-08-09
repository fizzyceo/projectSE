
const { Joi } = require('express-validation')
const isMongooseId = require('../helpers/isMongooseId')

const filterValidation = {
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
    sortField: Joi.string().optional().default("createdAt"),
    sortDirection: Joi.string().optional().default("desc").valid("asc", "desc"),
    dateFrom: Joi.date().optional(),
    dateTo: Joi.date().when("dateFrom", {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref("dateFrom")).required(),
        otherwise: Joi.forbidden(),
    }),
    search: Joi.string().optional(),
}



module.exports = {
    filterValidation,
}