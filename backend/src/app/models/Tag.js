import Sequelize, { Model } from 'sequelize';

class Tag extends Model {
    static init(sequelize) {
        super.init(
            {
                title: Sequelize.STRING,
            },
            { sequelize }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Tool, { foreignKey: 'tool_id', as: 'tool' });
    }
}

export default Tag;
