
const { Joi } = require('express-validation')
const isMongooseId = require('../helpers/isMongooseId')


const uploadImageDto = {
  body: Joi.object({
    image: Joi.any().required()
  }),
}
module.exports = {
  uploadImageDto
}
