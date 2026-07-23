const Joi = require("joi");
const postSchema = Joi.object({
  title: Joi.string().min(5).max(255).trim().required(),
  content: Joi.string().min(20).trim().required(),
  category: Joi.number().integer().positive().required(),
});

module.exports = postSchema;
