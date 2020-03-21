import Sequelize, { Model } from 'sequelize';

class Icon extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                path: Sequelize.STRING,
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `${process.env.APP_URL}/icons/${this.path}`;
                    },
                },
            },
            { sequelize }
        );
        return this;
    }
}

export default Icon;
