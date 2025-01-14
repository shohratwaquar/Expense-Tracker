const Joi = require('joi');

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().label("Current Password"),
  newPassword: Joi.string()
    .min(8) 
    .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&]).*$"))
    .required()
    .label("New Password")
    .messages({
      "string.length": "New password must be exactly 8 characters long.",
      "string.pattern.base": "Password should be combination of letter number and special character.",
    }),
  confirmPassword: Joi.any()
    .valid(Joi.ref('newPassword'))
    .required()
    .label("Confirm Password")
    .messages({
      "any.only": "Confirm password must match the new password.",
    }),
});

const validatePasswordChangeForm = (formData) => {
   const { error } = changePasswordSchema.validate(formData, { abortEarly: false });
   let errors = {
      currentPasswordError: null,
      newPasswordError: null,
    confirmPasswordError: null,
   };
  if (error) {
     error.details.forEach((err) => {
        if (err.path.includes('currentPassword')) {
           errors.currentPasswordError = err.message;
         }
         if (err.path.includes('newPassword')) {
            errors.newPasswordError = err.message;
         }
         if (err.path.includes('confirmPassword')) {
            errors.confirmPasswordError = err.message;
         }
      });
   }
   return errors;
};

exports.validatePassword = (req, res, next)=>{
     const errors = validatePasswordChangeForm(req.body);
     if(errors.confirmPasswordError ||errors.currentPasswordError || errors.newPasswordError){
        return res.status(403).json(errors);
     }
     req.user = {...req.user,password : req.body.currentPassword};
    next();
}
