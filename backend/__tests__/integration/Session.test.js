import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';
import auth from '../util/auth';

let token;

describe('Session', () => {
    beforeEach(async () => {
        await truncate();
        token = await auth();
    });

    request = request(app);

    it('should be able to log in', async () => {
        const user = await factory.attrs('UserCreate');
        const create = await request
            .post('/v1/users')
            .send(user)
            .set('Authorization', `Bearer ${token}`);

        expect(create.status).toBe(201);

        const response = await request.post('/v1/sessions').send({
            email: user.email,
            password: user.password,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
    });

    it('should not be able to log in when user not exists', async () => {
        const user = await factory.attrs('Session');
        const response = await request.post('/v1/sessions').send(user);
        expect(response.status).toBe(404);
    });

    it('should not be able to log in when password is wrong', async () => {
        const user = await factory.attrs('UserCreate');

        const create = await request
            .post('/v1/users')
            .send(user)
            .set('Authorization', `Bearer ${token}`);

        expect(create.status).toBe(201);

        const response = await request.post('/v1/sessions').send({
            email: user.email,
            password: `wrong${user.password}`,
        });
        expect(response.status).toBe(401);
    });

    it('should not be able to request if token not provided', async () => {
        const user = await factory.attrs('UserCreate');
        const response = await request.post('/v1/users').send(user);

        expect(response.status).toBe(401);
    });

    it('should not be able to request if the token is invalid', async () => {
        const user = await factory.attrs('UserCreate');
        const response = await request
            .post('/v1/users')
            .send(user)
            .set('Authorization', `Bearer invalid ${token}`);

        expect(response.status).toBe(401);
    });

    it('should not be able make requests in invalid routes', async () => {
        const response = await request.post('/invalid');
        expect(response.status).toBe(404);
    });
});
