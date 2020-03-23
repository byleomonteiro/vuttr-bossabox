import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';

request = request(app);

const token = async () => {
    const user = await factory.attrs('UserCreate');
    await request.post('/users').send(user);

    const login = await request.post('/sessions').send({
        email: user.email,
        password: user.password,
    });
    // return login.body.token;
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTM1LCJpYXQiOjE1ODQ3MzUyMjMsImV4cCI6MTU4NTM0MDAyM30.F9vcwL7Jq9KXYMXSQFzwdNoUZ6Wr5EqoWETuNhg2DIg';
};

export default token;
