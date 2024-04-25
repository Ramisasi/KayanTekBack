import { apiError } from "./errorHandle.js";
const validationMethod = ["headers", "params", "body", "query"];

export const validation = (schema) => {
  return (req, res, next) => {
    const validationError = [];
    validationMethod.forEach((key) => {
      if (schema[key]) {
        const validate = schema[key].validate(req[key], { abortEarly: false });
        if (validate?.error?.details) {
          if (process.env.mood == "dev") {
            validate.error.details.forEach((key2, index) => {
              validationError.push(validate.error.details[index].message);
            });
          }
        }
      }
    });

    if (validationError.length) next(new apiError(validationError, 400));
    else next();
  };
};
