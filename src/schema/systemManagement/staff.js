
const { Joi } = require('express-validation')
const isMongooseId = require('../../helpers/isMongooseId')

const createStaffDto = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneOne: Joi.string().required(),
    phoneTwo: Joi.string().optional(),
    role: Joi.string().required().valid('user'),
    profileImage: Joi.object({
      small: Joi.string().optional(),
      normal: Joi.string().optional(),
    }).optional(),
    permissions: Joi.array().optional().items(Joi.string()),
    about: Joi.string().optional()
  }),
}
const getStaffsDto = {
  body: Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
    email: Joi.string().email().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phoneOne: Joi.string().optional(),
    phoneTwo: Joi.string().optional(),
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


  }),
}

const getStaffDto = {
  params: Joi.object({
    id: Joi
      .string().required()
      .custom((value, helpers) => isMongooseId(value, helpers)),
  })
}

const suspendStaffDto = {
  params: Joi.object({
    id: Joi
      .string().required()
      .custom((value, helpers) => isMongooseId(value, helpers)),
  })
};

const activateStaffDto = {
  params: Joi.object({
    id: Joi
      .string().required()
      .custom((value, helpers) => isMongooseId(value, helpers)),
  })
}

const updateStaffDto = {
  body: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phoneOne: Joi.string().optional(),
    phoneTwo: Joi.string().optional(),
    profileImage: Joi.object({
      small: Joi.string().optional(),
      normal: Joi.string().optional(),
    }).optional(),
    status: Joi.string().optional().valid('Active', 'Suspended'),
    permissions: Joi.array().optional().items(Joi.string()),
    about: Joi.string().optional()
  }),
  params: Joi.object({
    id: Joi
      .string().required()
      .custom((value, helpers) => isMongooseId(value, helpers)),
  })
}

const deleteStaffDto = {
  params: Joi.object({
    id: Joi
      .string().required()
      .custom((value, helpers) => isMongooseId(value, helpers)),
  })
}

module.exports = {
  createStaffDto,
  getStaffsDto,
  getStaffDto,
  suspendStaffDto,
  activateStaffDto,
  updateStaffDto,
  deleteStaffDto
}
