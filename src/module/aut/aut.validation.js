import joi from "joi";

export const loginUser = {
  body: joi.object().keys({
    userName: joi.string().required(),
    password: joi.string().required(),
  }),
  Headers: joi.object().options({ allowUnknown: true }),
};

export const signUp = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "any.empty": "Email must not be empty",
        "string.email": "Please enter a valid email address",
      }),
      phoneNumber: joi
        .string()
        // .pattern(/^[0-9]+$/)
        .required()
        .messages({
          "any.required": "Phone number is required",
          "any.empty": "Phone number must not be empty",
          "string.pattern.base": "Phone number must contain only digits",
        }),
      userName: joi.string().min(4).max(8).required().messages({
        "any.required": "Username is required",
        "any.empty": "Username must not be empty",
        "string.min": "Username must be at least 4 characters long",
        "string.max": "Username cannot exceed 8 characters",
      }),
      password: joi
        .string()
        // .pattern(new RegExp())
        .required()
        .messages({
          "any.required": "Password is required",
          "any.empty": "Password must not be empty",
        }),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi
        .string()
        .required()
        // .regex(/^ecommerce__ [[0-9a-zA-Z]*$/)
        .messages({
          "any.required": "Authorization ID is required",
          "any.empty": "Authorization ID must not be empty",
        }),
    })
    .options({ allowUnknown: true }),
};

export const signIn = {
  body: joi.object().keys({
    userName: joi.string().required(),
    password: joi.string().required(),
  }),
};
