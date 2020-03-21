import { Op } from 'sequelize';

import Tool from '../models/Tool';
import Icon from '../models/Icon';

class ToolController {
    async index({ res }) {
        const tools = await Tool.findAll({
            attributes: ['id', 'title', 'link', 'description', 'tags'],
            include: [
                {
                    model: Icon,
                    as: 'icon',
                    attributes: ['path', 'url'],
                },
            ],
        });
        return res.json(tools);
    }

    async show(req, res) {
        const { tag } = req.query;
        const find = await Tool.findAll({
            where: {
                tags: {
                    [Op.contains]: [tag],
                },
            },
            include: [
                {
                    model: Icon,
                    as: 'icon',
                    attributes: ['path', 'url'],
                },
            ],
        });

        return res.json(find);
    }

    async store(req, res) {
        const { icon_id } = req.body;

        if (icon_id) {
            const iconExists = await Icon.findByPk(icon_id);
            if (!iconExists) {
                return res.status(400).json({ error: 'Icon does not exists' });
            }
        }

        const { id, title, link, description, tags } = await Tool.create(
            req.body
        );
        return res.status(201).json({
            icon_id,
            id,
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
                return res.status(400).json({ error: 'Icon does not exists' });
            }
        }

        const tool = await Tool.findByPk(req.params.id);

        if (!tool) {
            return res.status(400).json({ error: 'Tool does not exists' });
        }
        await tool.update(req.body);
        return res.json(tool);
    }

    async destroy(req, res) {
        const tool = await Tool.findByPk(req.params.id);
        if (!tool) {
            return res.status(400).json({ error: 'Tool does not exists' });
        }
        const icon = await Icon.findByPk(tool.icon_id);
        await icon.destroy();
        await tool.destroy();

        return res.status(204).send();
    }
}

export default new ToolController();
