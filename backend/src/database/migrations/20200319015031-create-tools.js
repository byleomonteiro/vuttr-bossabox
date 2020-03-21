module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('tools', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            icon_id: {
                type: Sequelize.INTEGER,
                references: { model: 'icons', key: 'id' },
                allowNull: true,
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            link: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: queryInterface => {
        return queryInterface.dropTable('tools');
    },
};
