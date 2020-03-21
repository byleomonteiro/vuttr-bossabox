import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class UserController {
    async index({ res }) {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email'],
        });
        return res.json(users);
    }

    async store(req, res) {
        const { email } = req.body;
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const { id, name } = await User.create(req.body);

        return res.status(201).json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }

    async update(req, res) {
        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (email && email !== user.email) {
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ error: 'User already exists' });
            }
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        const { id, name } = await user.update(req.body);

        return res.json({
            id,
            name,
            email,
        });
    }

    async destroy(req, res) {
        const user = await User.findByPk(req.userId);

        await user.destroy();
        return res.status(204).send();
    }
}

export default new UserController();
