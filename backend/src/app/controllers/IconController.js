import Icon from '../models/Icon';

class IconController {
    async store(req, res) {
        const { originalname: name, filename: path } = req.file;

        const { id, url } = await Icon.create({
            name,
            path,
        });

        return res.status(201).json({
            id,
            name,
            path,
            url,
        });
    }
}

export default new IconController();
