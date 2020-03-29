import { Op } from 'sequelize';
import Tool from '../models/Tool';
import Icon from '../models/Icon';

import RemoveFile from '../services/RemoveFile';

class ToolController {
    async index(req, res) {
        const { query } = req;

        const where = {};

        if (query.tag) {
            where.tags = {
                [Op.contains]: [query.tag],
            };
        }

        if (query.user_id) {
            where.user_id = query.user_id;
        }

        const find = await Tool.findAll({
            where,
            attributes: ['id', 'title', 'link', 'description', 'tags'],
            include: [
                {
                    model: Icon,
                    as: 'icon',
                    attributes: ['path', 'url'],
                },
            ],
        });

        if (find.length < 1) {
            return res.status(404).json({ error: 'No data was found' });
        }

        return res.json(find);
    }

    async store(req, res) {
        const { icon_id, title, link, description, tags } = req.body;

        if (icon_id) {
            const iconExists = await Icon.findByPk(icon_id);
            if (!iconExists) {
                return res.status(404).json({ error: 'Icon not found' });
            }
        }

        const { id } = await Tool.create({
            user_id: req.userId,
            icon_id,
            title,
            link,
            description,
            tags,
        });

        return res.status(201).json({
            id,
            icon_id,
            title,
            link,
            description,
            tags,
        });
    }

    async update(req, res) {
        const { icon_id } = req.body;

        if (icon_id) {
            const iconExists = await Icon.findByPk(icon_id);
            if (!iconExists) {
                return res.status(404).json({ error: 'Icon not found' });
            }
        }

        const tool = await Tool.findByPk(req.params.id, {
            where: {
                user_id: req.userId,
            },
            attributes: ['id', 'title', 'link', 'description', 'tags'],
            include: [
                {
                    model: Icon,
                    as: 'icon',
                    attributes: ['path', 'url'],
                },
            ],
        });

        if (!tool) {
            return res.status(404).json({ error: 'Tool not found' });
        }

        await tool.update(req.body);

        return res.json(tool);
    }

    async destroy(req, res) {
        const tool = await Tool.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId,
            },
            include: [
                {
                    model: Icon,
                    as: 'icon',
                    attributes: ['path'],
                },
            ],
        });

        if (!tool) {
            return res.status(404).json({ error: 'Tool not found' });
        }

        if (tool.icon_id !== null) {
            const icon = await Icon.findByPk(tool.icon_id);
            await RemoveFile(tool.icon.path);
            await icon.destroy();
        }

        await tool.destroy();

        return res.status(204).send();
    }
}

export default new ToolController();
