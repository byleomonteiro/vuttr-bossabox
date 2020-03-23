import Sequelize, { Model } from 'sequelize';

class Tool extends Model {
    static init(sequelize) {
        super.init(
            {
                title: Sequelize.STRING,
                link: Sequelize.STRING,
                description: Sequelize.TEXT,
                tags: Sequelize.ARRAY(Sequelize.TEXT),
            },
            { sequelize }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Icon, { foreignKey: 'icon_id', as: 'icon' });
    }
}

export default Tool;
