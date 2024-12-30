import Joi from "joi";

export const finishGameParamsSchema = Joi.object().keys({
    gamePlayId: Joi.string().required(),
});

export const finishGameBodySchema = Joi.object().keys({
    payload: Joi.string().required(),
});
