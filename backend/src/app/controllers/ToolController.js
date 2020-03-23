import { Op } from 'sequelize';
import Tool from '../models/Tool';
import Icon from '../models/Icon';

import Cache from '../../lib/Cache';

import RemoveFile from '../services/RemoveFile';

class ToolController {
    async index({ res }) {
        const cached = await Cache.get('tools');

        if (cached) return res.json(cached);

        const tools = await Tool.findAll({
            attributes: [
                'icon_id',
                'id',
                'title',
                'link',
                'description',
                'tags',
            ],
            include: [
                {
                    model: Icon,
                    as: 'icon',
                    attributes: ['path', 'url'],
                },
            ],
        });

        await Cache.set('tools', tools);

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
            attributes: [
                'icon_id',
                'id',
                'title',
                'link',
                'description',
                'tags',
            ],
            include: [
                {
                    model: Icon,
                    as: 'icon',
                    attributes: ['path', 'url'],
                },
            ],
        });

        if (find.length < 1) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        return res.json(find);
    }

    async store(req, res) {
        const { icon_id } = req.body;

        if (icon_id) {
            const iconExists = await Icon.findByPk(icon_id);
            if (!iconExists) {
                return res.status(404).json({ error: 'Icon not found' });
            }
        }

        const { id, title, link, description, tags } = await Tool.create(
            req.body
        );

        const checkCache = await Cache.get('tools');

        if (checkCache) {
            await Cache.invalidate('tools');
        }

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
                return res.status(404).json({ error: 'Icon not found' });
            }
        }

        const tool = await Tool.findByPk(req.params.id, {
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
        const tool = await Tool.findByPk(req.params.id, {
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

        const checkCache = await Cache.get('tools');
        if (checkCache) {
            await Cache.invalidate('tools');
        }

        return res.status(204).send();
    }
}

export default new ToolController();
