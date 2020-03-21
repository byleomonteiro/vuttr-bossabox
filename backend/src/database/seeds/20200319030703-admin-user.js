const bcrypt = require('bcryptjs');

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('users', [
            {
                name: 'John Doe',
                email: 'jhon@email.com',
                password_hash: bcrypt.hashSync('12345678', 8),
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    down: queryInterface => {
        return queryInterface.bulkDelete('users', null, {});
    },
};
