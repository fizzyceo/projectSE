
const { Joi } = require('express-validation')
const isMongooseId = require('../../helpers/isMongooseId')

const createAlertDto = {
  body: Joi.object({
    type: Joi.string().required(),
    location: Joi.array().optional().items(Joi.number()).length(2),
    device: Joi.string().custom((value, helpers) => isMongooseId(value, helpers)).required(),
    detectionTime: Joi.date().optional()
  })
}
const getAlertsDto = {
  body: Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
    sortField: Joi.string().optional().default("createdAt"),
    sortDirection: Joi.string().optional().default("desc").valid("asc", "desc"),
    status: Joi.string().optional().valid('Active', 'Suspended', 'Pending'),
    sortDirection: Joi.string().optional().default("desc").valid("asc", "desc"),
    dateFrom: Joi.date().optional(),
    dateTo: Joi.date().when("dateFrom", {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref("dateFrom")).required(),
      otherwise: Joi.forbidden(),
    }),
    search: Joi.string().optional(),
    falsePositive: Joi.boolean().optional(),  
    wilaya: Joi.string().optional(),
    region: Joi.string().optional(),
    type: Joi.string().optional(),
    code: Joi.string().optional(),
    detectionTime: Joi.date().optional(),
    location: Joi.array().optional().items(Joi.number()).length(2),
    devId:Joi.string().optional(),
    
  }),
}

const getAlertDto = {
  params: Joi.object({
    id: Joi
      .string().required()
      .custom((value, helpers) => isMongooseId(value, helpers)),
  })
}
const updateAlertDto = {
  body: Joi.object({
    falsePositive: Joi.boolean().optional(),
  }),
  params: Joi.object({
    id: Joi
      .string().required()
      .custom((value, helpers) => isMongooseId(value, helpers)),
  })
}

const deleteAlertDto = {
  params: Joi.object({
    id: Joi
      .string().required()
      .custom((value, helpers) => isMongooseId(value, helpers)),
  })
}

module.exports = {
  createAlertDto,
  getAlertsDto,
  getAlertDto,
  updateAlertDto,
  deleteAlertDto
}
