import database from '../../src/database/index';

export default function truncate() {
    return Promise.all(
        Object.keys(database.connection.models).map(key => {
            return database.connection.models[key].destroy({
                truncate: true,
                cascade: true,
                force: true,
            });
        })
    );
}
