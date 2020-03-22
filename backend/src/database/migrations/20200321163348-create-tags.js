module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('tags', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            tool_id: {
                type: Sequelize.INTEGER,
                references: { model: 'tools', key: 'id' },
                allownull: false,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            title: {
                type: Sequelize.STRING,
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
        return queryInterface.dropTable('tags');
    },
};
