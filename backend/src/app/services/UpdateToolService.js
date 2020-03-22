import Tool from '../models/Tool';
import Tag from '../models/Tag';

class UpdateToolService {
    async run({ tool_id, title, link, description, tags }) {
        const tool = await Tool.findByPk(tool_id);

        if (!tool) {
            throw new Error('Tool does not exists');
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
        return tool;
    }
}

export default new UpdateToolService();
