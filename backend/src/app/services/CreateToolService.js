import Tool from '../models/Tool';
import Tag from '../models/Tag';

import Cache from '../../lib/Cache';

class CreateToolService {
    async run({ icon_id, title, link, description, tags }) {
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

        const checkCache = await Cache.get('tools');
        if (checkCache) {
            await Cache.invalidate('tools');
        }

        return findTool;
    }
}

export default new CreateToolService();
