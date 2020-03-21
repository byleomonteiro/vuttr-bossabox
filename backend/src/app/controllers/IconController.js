import Icon from '../models/Icon';

class IconController {
    async store(req, res) {
        const { originalname: name, filename: path } = req.file;

        const icon = await Icon.create({
            name,
            path,
        });

        return res.status(201).json(icon);
    }

    async delete(req, res) {
        const icon = await Icon.findByPk(req.params.id);

        if (!icon) {
            return res.status(400).json({ error: 'Icon does not exists' });
        }
        await icon.destroy();
        return res.status(204).send();
    }
}

export default new IconController();
