const Joi = require("joi");
const schema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().max(255).email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
  otp: Joi.string().pattern(/^[0-9]{6}$/),
});

module.exports = schema;
