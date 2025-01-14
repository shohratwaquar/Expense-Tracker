const Joi = require('joi');

const nameAndEmailSchema = Joi.object({
  name: Joi.string()
    .min(3) 
    .max(30) 
    .regex(/^[a-zA-Z\s]+$/)
    .required()
    .label('Name')
    .messages({
      'string.empty': 'Name is required.',
      'string.min': 'Name must be at least 3 characters long.',
      'string.max': 'Name cannot be longer than 30 characters.',
      'string.pattern.base': 'Name can only contain letters and spaces.',
    }),
  
  email: Joi.string()
    .email({ tlds: { allow: false } }) 
    .required()
    .label('Email')
    .messages({
      'string.empty': 'Email is required.',
      'string.email': 'Please provide a valid email address.',
    }),
});

const validateUpdatedetails = (formData) => {
  const { error } = nameAndEmailSchema.validate(formData, { abortEarly: false });
  let errors = {
    nameError: null,
    emailError: null,
  };

  if (error) {
    error.details.forEach((err) => {
      if (err.path.includes('name')) {
        errors.nameError = err.message;
      }
      if (err.path.includes('email')) {
        errors.emailError = err.message;
      }
    });
  }

  return errors;
};

const validateUpdate = async (req, res , next) =>{
  const errors = validateUpdatedetails(req.body);
  if(errors.emailError || errors.nameError){
      return res.status(300).json(errors);
  }
  next();
}


module.exports = validateUpdate;
