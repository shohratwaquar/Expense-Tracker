const Joi = require("joi").extend(require('@joi/date'));

const addTransactionSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .required()
    .label("Transaction Name")
    .messages({
      "string.empty": "Transaction name is required.",
      "string.min": "Transaction name must be at least 3 characters long.",
      "string.max": "Transaction name cannot be longer than 30 characters.",
      "string.pattern.base": "Transaction name can only contain letters, numbers, and spaces.",
    }),

  amount: Joi.number()
    .min(1)
    .max(10000000)
    .precision(2)
    .required()
    .messages({
      "number.base": "Amount must be a number",
      "number.min": "Amount should be greater than 0",
      "number.max": "Amount cannot exceed 10,000,000",
      "number.precision": "Amount can have up to 2 decimal places",
    }),

  date: Joi.date()
    .format("YYYY-MM-DD")
    .required()
    .messages({
      "date.format": "Date must be in YYYY-MM-DD format.",
      "any.required": "Date of transaction is required.",
    }),

  description: Joi.string()
    .pattern(/^[a-zA-Z0-9\s]*$/)
    .required()
    .messages({
      "string.empty": "Description is required.",
      "string.pattern.base": "Description can only contain letters, numbers, and spaces.",
    }),
});

const validateAddTransaction = (req, res, next) => {
  const { error } = addTransactionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  
  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      const field = err.path[0];
      errors[field] = err.message;
    });
    console.log(errors);
    return res.status(400).json({ message: "Validation Failed", errors });
  }

  next();
};

module.exports = validateAddTransaction;
