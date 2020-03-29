import * as Yup from 'yup';

export default async (req, res, next) => {
    try {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            bio: Yup.string(),
            url: Yup.string().url(),
            techs: Yup.array().min(1),
            oldPassword: Yup.string(),
            password: Yup.string()
                .min(8)
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        await schema.validate(req.body, { abortEarly: true });
        return next();
    } catch (err) {
        return res
            .status(400)
            .json({ error: 'Validation fails', messages: err.inner });
    }
};
