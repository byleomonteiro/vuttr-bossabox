import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';

request = request(app);

const token = async () => {
    const user = await factory.attrs('Sessions');
    await request.post('/v1/users').send(user);

    const login = await request.post('/v1/sessions').send({
        email: user.email,
        password: user.password,
    });
    return login.body.token;
};

export default token;
