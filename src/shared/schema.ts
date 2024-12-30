import Joi from "joi";

export const page = Joi.number().min(1).default(1);
export const limit = Joi.number().min(5).max(30).default(20);
export const sort = Joi.string().valid("desc", "asc").default("asc");

export const positiveNumber = Joi.number().greater(0);
export const negativeNumber = Joi.number().less(0);
export const email = Joi.string().email();
