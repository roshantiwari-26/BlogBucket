const Joi = require("joi");
const loginSchema = Joi.object({
  email: Joi.string().max(255).email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});

module.exports = loginSchema;
