const Joi = require("joi");

const signUpSchema = Joi.object({
    name: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .label("Transaction Name")
    .messages({
      "string.empty": "Transaction name is required.",
      "string.min": "Transaction name must be at least 3 characters long.",
      "string.max": "Transaction name cannot be longer than 30 characters.",
      "string.pattern.base": "Transaction name can only contain letters and spaces.",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
  password: Joi.string()
    .min(8)
    .required()
    .custom((value, helpers) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*]/.test(value);

      if (!hasUpperCase || !hasLowerCase) {
        return helpers.message("Password must contain both uppercase and lowercase letters");
      }
      if (!hasNumber) {
        return helpers.message("Password must be a combination of alphabet and number");
      }
      if (!hasSpecialChar) {
        return helpers.message("Password must contain at least one special character");
      }
      if (value.length < 8) {
        return helpers.message("Password must be at least 8 characters");
      }

      return value;
    })
    .messages({
      "string.empty": "Password is required",
    }),
    confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .messages({
        "any.required": "Confirm Password is required",
        "string.empty": "Confirm Password cannot be empty",
      "any.only": "Password does not match",
    })
});

const validateSignUp = (req, res, next) => {
  const { error } = signUpSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  
  if (error) {
    const errors = error.details.reduce((acc, err) => {
        console.log(err);
      const field = err.path[0];
      acc[field] = err.message;
      return acc;
    }, {});
    console.log(errors);
    return res.status(400).json({ message: "Validation Failed", errors });
  }

  next();
};

module.exports = validateSignUp;
