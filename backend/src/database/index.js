import Sequelize from 'sequelize';

import User from '../app/models/User';
import Icon from '../app/models/Icon';
import Tool from '../app/models/Tool';

import databaseConfig from '../config/database';

const models = [User, Icon, Tool];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models.map(model => model.init(this.connection));
        models.map(
            model => model.associate && model.associate(this.connection.models)
        );
    }
}

export default new Database();
