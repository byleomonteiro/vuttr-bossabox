import Sequelize, { Model } from 'sequelize';

class Tool extends Model {
    static init(sequelize) {
        super.init(
            {
                title: Sequelize.STRING,
                link: Sequelize.STRING,
                description: Sequelize.TEXT,
            },
            { sequelize }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Icon, { foreignKey: 'icon_id', as: 'icon' });
        this.hasMany(models.Tag);
    }
}

export default Tool;
