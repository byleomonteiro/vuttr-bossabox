import { Op } from 'sequelize';
import User from '../models/User';

class UserController {
    async index(req, res) {
        const { tech } = req.query;

        const where = {};

        if (tech) {
            where.techs = {
                [Op.contains]: [tech],
            };
        }

        const users = await User.findAll({
            where,
            attributes: ['id', 'name', 'bio', 'email', 'url', 'techs'],
        });

        if (users.length < 1) {
            return res.status(404).json({ error: 'No data was found' });
        }

        return res.json(users);
    }

    async store(req, res) {
        const { email } = req.body;
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const { id, name, bio, url, techs } = await User.create(req.body);

        return res.status(201).json({
            id,
            name,
            bio,
            email,
            url,
            techs,
        });
    }

    async update(req, res) {
        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (email) {
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res
                    .status(400)
                    .json({ error: 'Email is already in use' });
            }
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        const { id, name, bio, url, techs } = await user.update(req.body);

        return res.json({
            id,
            name,
            bio,
            email,
            url,
            techs,
        });
    }
}

export default new UserController();
