import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../src/app';

import truncate from '../util/truncate';

import factory from '../factories';
import auth from '../util/auth';

let token;

describe('User', () => {
    beforeEach(async () => {
        await truncate();
        token = await auth();
    });

    request = request(app);

    it('should encrypt user password when new user created', async () => {
        const user = await factory.create('UserCreate', {
            password: '12345678',
        });

        const compareHash = await bcrypt.compare(
            '12345678',
            user.password_hash
        );

        expect(compareHash).toBe(true);
    });

    it('should be able to return all users', async () => {
        const user = await factory.attrs('UserCreate');
        const create = await request
            .post('/v1/users')
            .send(user)
            .set('Authorization', `Bearer ${token}`);

        expect(create.status).toBe(201);

        const response = await request
            .get('/v1/users')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('should be able to register', async () => {
        const user = await factory.attrs('UserCreate');
        const response = await request
            .post('/v1/users')
            .send(user)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
    });

    it('should not be able to register with duplicated email', async () => {
        const user = await factory.attrs('UserCreate');
        const create = await request
            .post('/v1/users')
            .send(user)
            .set('Authorization', `Bearer ${token}`);

        expect(create.status).toBe(201);

        const response = await request
            .post('/v1/users')
            .send(user)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
    });

    it('should not be able to update password with a wrong old password', async () => {
        /* const { oldPassword, password, confirmPassword } = await factory.attrs(
            'UserUpdate'
        );
        const response = await request
            .put('/v1/users')
            .send({
                oldPassword,
                password,
                confirmPassword,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(401); */
    });
    it('should be able to update a user', async () => {});
    it('should not be able to update with a existing mail', async () => {});

    it('should be able to delete user', async () => {
        // const user = await factory.attrs('UserCreate');
        // const create = await request
        //     .post('/v1/users')
        //     .send(user)
        //     .set('Authorization', `Bearer ${token}`);
        // expect(create.status).toBe(201);
        // const response = await request
        //     .delete(`/v1/users/`)
        //     .set('Authorization', `Bearer ${token}`);
        // expect(response.status).toBe(204);
    });
});
