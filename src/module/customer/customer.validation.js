// imports section
import joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(joi);

// create user validators , this's create user schema for validate input data
export const updateCustomer = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().required().messages({
        "any.required": "username is required",
        "any.empty": "username must to be not empty",
      }),
      password: joi.string().required().messages({
        "any.required": "password is required",
        "any.empty": "password must to be not empty",
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
          "any.required": "authorization id is required",
          "any.empty": "authorization id must to be not empty",
        }),
    })
    .options({ allowUnknown: true }),
  params: joi
    .object()
    .required()
    .keys({
      id: myJoiObjectId()
        .required()
        // .regex(/^ecommerce__ [[0-9a-zA-Z]*$/)
        .messages({
          "any.required": "id is required",
          "any.empty": "id must to be not empty",
        }),
    }),
};
export const deleteCustomer = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi
        .string()
        .required()
        // .regex(/^ecommerce__ [[0-9a-zA-Z]*$/)
        .messages({
          "any.required": "authorization id is required",
          "any.empty": "authorization id must to be not empty",
        }),
    })
    .options({ allowUnknown: true }),
  params: joi
    .object()
    .required()
    .keys({
      id: myJoiObjectId()
        .required()
        // .regex(/^ecommerce__ [[0-9a-zA-Z]*$/)
        .messages({
          "any.required": "id is required",
          "any.empty": "id must to be not empty",
        }),
    }),
};
