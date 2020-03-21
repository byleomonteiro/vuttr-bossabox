import { Op } from 'sequelize';

import Tool from '../models/Tool';
import Icon from '../models/Icon';
import Tag from '../models/Tag';

class ToolController {
    async index({ res }) {
        const tools = await Tool.findAll({
            attributes: ['id', 'title', 'link', 'description'],
            include: [
                {
                    model: Icon,
                    as: 'icon',
                    attributes: ['path', 'url'],
                },
                {
                    model: Tag,
                    attributes: ['id', 'title'],
                },
            ],
        });

        return res.json(tools);
    }

    async show(req, res) {
        const { tag } = req.query;
        const find = await Tool.findAll({
            attributes: ['id', 'title', 'link', 'description'],
            include: [
                {
                    model: Icon,
                    as: 'icon',
                    attributes: ['path', 'url'],
                },
                {
                    model: Tag,
                    attributes: ['id', 'title'],
                    where: {
                        title: tag,
                    },
                },
            ],
        });

        return res.json(find);
    }

    async store(req, res) {
        const { icon_id, title, link, description, tags } = req.body;

        if (icon_id) {
            const iconExists = await Icon.findByPk(icon_id);
            if (!iconExists) {
                return res.status(400).json({ error: 'Icon does not exists' });
            }
        }
        const tool = await Tool.create({ icon_id, title, link, description });

        if (tags) {
            await Promise.all(
                tags.map(async tag => {
                    await Tag.create({
                        title: tag,
                        tool_id: tool.id,
                    });
                })
            );
        }

        const findTool = await Tool.findByPk(tool.id, {
            include: [
                {
                    model: Tag,
                    attributes: ['id', 'title'],
                },
            ],
        });
        return res.status(201).json(findTool);
    }

    async update(req, res) {
        const { icon_id, title, link, description, tags } = req.body;

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
        await tool.update({ title, link, description });

        if (tags) {
            await Promise.all(
                tags.map(async tag => {
                    await Tag.update(
                        {
                            title: tag,
                            tool_id: tool.id,
                        },
                        {
                            where: {
                                tool_id: tool.id,
                            },
                        }
                    );
                })
            );
        }

        return res.json(tool);
    }

    async destroy(req, res) {
        const tool = await Tool.findByPk(req.params.id);
        if (!tool) {
            return res.status(400).json({ error: 'Tool does not exists' });
        }

        if (tool.icon_id !== null) {
            const icon = await Icon.findByPk(tool.icon_id);
            await icon.destroy();
        }

        await tool.destroy();

        return res.status(204).send();
    }
}

export default new ToolController();
