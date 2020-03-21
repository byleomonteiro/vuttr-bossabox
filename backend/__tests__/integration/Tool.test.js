import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';
import truncate from '../util/truncate';
import auth from '../util/auth';

let token;

describe('Tool', () => {
    beforeEach(async () => {
        await truncate();
        token = await auth();
    });

    request = request(app);

    it('should be able to register a new tool', async () => {
        // const { title, link, description, tags } = await factory.attrs('Tool');
        // const response = await request
        //     .post('/tools')
        //     .send({
        //         title,
        //         link,
        //         description,
        //         tags,
        //     })
        //     .set('Authorization', `Bearer ${token}`);
        // expect(response.status).toBe(201);
    });

    it('should be able to list all tools', async () => {
        const response = await request
            .get('/tools')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it('should be able to search tools by tag', async () => {
        /* const response = await request
            .get('/find')
            .query({ tag: 'node' })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200); */
    });
});
