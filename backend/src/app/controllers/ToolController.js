import Tool from '../models/Tool';
import Icon from '../models/Icon';
import Tag from '../models/Tag';

import CreateToolService from '../services/CreateToolService';
import UpdateToolService from '../services/UpdateToolService';

import Cache from '../../lib/Cache';

class ToolController {
    async index({ res }) {
        const cached = await Cache.get('tools');

        if (cached) return res.json(cached);

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
        await Cache.set('tools', tools);

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
                return res.status(400).json('Icon does not exists');
            }
        }
        const tool = await CreateToolService.run({
            icon_id,
            title,
            link,
            description,
            tags,
        });

        return res.status(201).json(tool);
    }

    async update(req, res) {
        const { icon_id, title, link, description, tags } = req.body;

        if (icon_id) {
            const iconExists = await Icon.findByPk(icon_id);
            if (!iconExists) {
                return res.status(400).json({ error: 'Icon does not exists' });
            }
        }

        const tool = await UpdateToolService.run({
            tool_id: req.params.id,
            title,
            link,
            description,
            tags,
        });

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

        const checkCache = await Cache.get('tools');
        if (checkCache) {
            await Cache.invalidate('tools');
        }

        return res.status(204).send();
    }
}

export default new ToolController();
