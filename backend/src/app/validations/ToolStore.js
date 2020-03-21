import * as Yup from 'yup';

export default async (req, res, next) => {
    try {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            link: Yup.string()
                .url()
                .required(),
            description: Yup.string().required(),
            tags: Yup.array().required(),
        });

        await schema.validate(req.body, { abortEarly: true });
        return next();
    } catch (err) {
        return res
            .status(400)
            .json({ error: 'Validation fails', messages: err.inner });
    }
};
