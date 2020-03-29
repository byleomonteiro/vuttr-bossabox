import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';
import auth from '../util/auth';

let login;

describe('Session', () => {
    beforeEach(async () => {
        await truncate();
        login = await auth();
    });

    request = request(app);

    it('should be able to log in', async () => {
        const user = await factory.attrs('User');
        const create = await request.post('/v1/users').send(user);

        expect(create.status).toBe(201);

        const response = await request.post('/v1/sessions').send({
            email: user.email,
            password: user.password,
        });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            user: {
                id: response.body.user.id,
                name: response.body.user.name,
                email: response.body.user.email,
            },
            token: response.body.token,
        });
    });

    it('should not be able to log in when user does not exists', async () => {
        const user = await factory.attrs('User');
        const response = await request.post('/v1/sessions').send({
            email: user.email,
            password: user.password,
        });

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            error: 'User not found',
        });
    });

    it('should not be able to log in when password is wrong', async () => {
        const user = await factory.attrs('User');

        const create = await request.post('/v1/users').send(user);

        expect(create.status).toBe(201);

        const response = await request.post('/v1/sessions').send({
            email: user.email,
            password: `wrong${user.password}`,
        });

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            error: 'Password does not match',
        });
    });

    it('should not be able to request if token does not provided', async () => {
        const response = await request.get('/v1/users');

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            error: 'Token not provided',
        });
    });

    it('should not be able to request if token is invalid', async () => {
        const response = await request
            .get('/v1/users')

            .set('Authorization', `Bearer invalid ${login.token}`);

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            error: 'Token invalid',
        });
    });

    it('should not be able make requests in invalid routes', async () => {
        const response = await request.post('/invalid');

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            error: 'Route not found',
        });
    });
});
