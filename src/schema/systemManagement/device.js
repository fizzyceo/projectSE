
const { Joi } = require('express-validation')
const isMongooseId = require('../../helpers/isMongooseId')

const createDeviceDto = {
  body: Joi.object({
    label: Joi.string().required(),
    type: Joi.string().required().valid("camera","temperature","wind","windTemp"),
    version: Joi.string().required(),
    wilaya: Joi.string().required(),
    region: Joi.string().required(),
    statusDetails: Joi.string().required(),
    devId: Joi.string().required(),
    location: Joi.array().optional().items(Joi.number()).length(2),
     status: Joi.string().optional().valid('online', 'offline'),
    lastOnline: Joi.date().required(),
    siteId: Joi.string().required()

  })
}
const getDevicesDto = {
  body: Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
    sortField: Joi.string().optional().default("createdAt"),
    sortDirection: Joi.string().optional().default("desc").valid("asc", "desc"),
    status: Joi.string().optional(),
    sortDirection: Joi.string().optional().default("desc").valid("asc", "desc"),
    dateFrom: Joi.date().optional(),
    dateTo: Joi.date().when("dateFrom", {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref("dateFrom")).required(),
      otherwise: Joi.forbidden(),
    }),
    search: Joi.string().optional().allow(""),
    wilaya: Joi.string().optional(),
    region: Joi.string().optional(),
    type: Joi.string().optional(),
    label:Joi.string().optional(),
    code: Joi.string().optional(),
    detectionTime: Joi.date().optional(),
    location: Joi.array().optional().items(Joi.number()).length(2),
    version:Joi.string().optional(),
    devId:Joi.string().optional(),
    siteId:Joi.string().optional(),

  }),
}

const getDeviceDto = {
  params: Joi.object({
    id: Joi
      .string().required()
      .custom((value, helpers) => isMongooseId(value, helpers)),
  })
}
const updateDeviceDto = {
  body: Joi.object({
    label: Joi.string().optional(),
    type: Joi.string().optional(),
    version: Joi.string().optional(),
    wilaya: Joi.string().optional(),
    region: Joi.string().optional(),
    devId: Joi.string().optional(),
    statusDetails: Joi.string().optional(),
    location: Joi.array().optional().items(Joi.number()).length(2),
    status: Joi.string().optional().valid('online', 'offline'),
  }),
  params: Joi.object({
    id: Joi
      .string().required()
      .custom((value, helpers) => isMongooseId(value, helpers)),
  })
}

const deleteDeviceDto = {
  params: Joi.object({
    id: Joi
      .string().required()
      .custom((value, helpers) => isMongooseId(value, helpers)),
  })
}

module.exports = {
  createDeviceDto,
  getDevicesDto,
  getDeviceDto,
  updateDeviceDto,
  deleteDeviceDto
}
