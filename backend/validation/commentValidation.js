const Joi = require("joi");
const commentSchema = Joi.object({
  comment: Joi.string().trim().min(3).max(255).required(),
});

module.exports = commentSchema;
