import { email } from "@shared/schema";
import Joi from "joi";

export const userLoginSchema = Joi.object().keys({
    userEmail: email.required(),
});

export const userLinkSocialSchema = Joi.object().keys({
    social: Joi.string().valid("instagram", "tiktok").required(),
});

export const userIncreaseLifePointSchema = Joi.object().keys({
    payload: Joi.string().required(),
});
