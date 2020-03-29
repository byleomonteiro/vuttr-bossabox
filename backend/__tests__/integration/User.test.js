import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../src/app';

import truncate from '../util/truncate';

import factory from '../factories';
import auth from '../util/auth';

let login;

describe('User', () => {
    beforeEach(async () => {
        await truncate();
        login = await auth();
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

    it('should be able to register an user', async () => {
        const user = await factory.attrs('User');
        const response = await request.post('/v1/users').send(user);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            id: response.body.id,
            name: response.body.name,
            email: response.body.email,
        });
    });

    it('should be able to return all users', async () => {
        const user = await factory.attrs('User');
        const create = await request.post('/v1/users').send(user);

        expect(create.status).toBe(201);

        const response = await request
            .get('/v1/users')
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(
            response.body.map(object => object)
        );
    });

    it('should not be able to register with duplicated email', async () => {
        const user = await factory.attrs('User');
        const create = await request.post('/v1/users').send(user);

        expect(create.status).toBe(201);

        const response = await request.post('/v1/users').send(user);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            error: 'User already exists',
        });
    });

    it('should not be able to update password with a wrong old password', async () => {
        const response = await request
            .put('/v1/users')
            .send({
                name: 'testing',
                email: 'test@email.com',
                oldPassword: '123456789',
                password: '1234567890',
                confirmPassword: '1234567890',
            })
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            error: 'Password does not match',
        });
    });

    it('should be able to update a user', async () => {
        const response = await request
            .put('/v1/users')
            .send({
                name: 'Teste',
                email: 'test@email.com',
            })
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: response.body.id,
            name: response.body.name,
            email: response.body.email,
        });
    });

    it('should not be able to update an user with a existing email', async () => {
        const response = await request
            .put('/v1/users')
            .send({
                email: login.email,
            })
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            error: 'Email is already in use',
        });
    });
});
