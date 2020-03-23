export default {
    catchNotFound(req, res, next) {
        next();
        return res.status(404).json({ error: 'Route not found' });
    },
};
