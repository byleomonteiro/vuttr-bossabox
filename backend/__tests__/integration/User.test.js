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
        const user = await factory.create('User', {
            password: '12345678',
        });

        const compareHash = await bcrypt.compare(
            '12345678',
            user.password_hash
        );

        expect(compareHash).toBe(true);
    });

    it('should be able to register', async () => {
        const user = await factory.attrs('User');
        const response = await request.post('/v1/users').send(user);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
    });

    it('should be able to return all users', async () => {
        const user = await factory.attrs('User');
        const create = await request.post('/v1/users').send(user);

        expect(create.status).toBe(201);

        const response = await request
            .get('/v1/users')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('should not be able to register with duplicated email', async () => {
        const user = await factory.attrs('User');
        const create = await request.post('/v1/users').send(user);

        expect(create.status).toBe(201);

        const response = await request.post('/v1/users').send(user);

        expect(response.status).toBe(400);
    });

    it('should not be able to update password with a wrong old password', async () => {
        const { name, email, password } = await factory.attrs('User');
        const create = await request.post('/v1/users').send({
            name,
            email,
            password: '987654321',
        });

        expect(create.status).toBe(201);

        const response = await request
            .put(`/v1/users/${create.body.user.id}`)
            .send({
                name,
                email: 'test@email.com',
                oldPassword: password,
                password: '123456789',
                confirmPassword: '123456789',
            })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });

    it('should be able to update a user', async () => {
        const { name, email, password } = await factory.attrs('User');
        const create = await request.post('/v1/users').send({
            name,
            email,
            password,
        });

        expect(create.status).toBe(201);

        const response = await request
            .put(`/v1/users/${create.body.user.id}`)
            .send({
                name,
                email: 'test@email.com',
                oldPassword: password,
                password: '123456789',
                confirmPassword: '123456789',
            })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('email');
    });

    it('should not be able to update with a existing mail', async () => {
        const { name, password } = await factory.attrs('User');
        const create = await request.post('/v1/users').send({
            name,
            email: 'test@mail.com',
            password,
        });

        expect(create.status).toBe(201);

        const response = await request
            .put(`/v1/users/${create.body.user.id}`)
            .send({
                email: 'test@mail.com',
            })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should not be able to update if user not exists', async () => {
        const response = await request
            .put('/v1/users/60')
            .send({
                email: 'test@mail.com',
            })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    it('should be able to delete user', async () => {
        const { name, email, password } = await factory.attrs('User');
        const create = await request.post('/v1/users').send({
            name,
            email,
            password,
        });

        expect(create.status).toBe(201);

        const response = await request
            .delete(`/v1/users/${create.body.user.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(204);
    });
});
