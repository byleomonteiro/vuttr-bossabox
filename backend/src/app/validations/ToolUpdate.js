import * as Yup from 'yup';

export default async (req, res, next) => {
    try {
        const schema = Yup.object().shape({
            icon_id: Yup.number(),
            title: Yup.string(),
            link: Yup.string().url(),
            description: Yup.string(),
            tags: Yup.array().min(1),
        });

        await schema.validate(req.body, { abortEarly: true });
        return next();
    } catch (err) {
        return res
            .status(400)
            .json({ error: 'Validation fails', message: err.inner });
    }
};
