import * as Yup from 'yup';

export default async (req, res, next) => {
    try {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            bio: Yup.string(),
            url: Yup.string()
                .url()
                .required(),
            techs: Yup.array()
                .min(1)
                .required(),
            password: Yup.string()
                .min(8)
                .required(),
        });

        await schema.validate(req.body, { abortEarly: true });
        return next();
    } catch (err) {
        return res
            .status(400)
            .json({ error: 'Validation fails', messages: err.inner });
    }
};
