import request from 'supertest';

import Tag from '../../src/app/models/Tag';

import factory from '../factories';
import app from '../../src/app';
import truncate from '../util/truncate';
import auth from '../util/auth';

let token;

describe('Tool', () => {
    beforeAll(async () => {
        await truncate();
        token = await auth();
    });

    request = request(app);

    it('should be able to register a new tool', async () => {
        const { icon_id, title, link, description, tags } = await factory.attrs(
            'Tool'
        );
        const tool = await request
            .post('/v1/tools')
            .send({
                icon_id,
                title,
                link,
                description,
            })
            .set('Authorization', `Bearer ${token}`);

        expect(tool.status).toBe(201);

        if (tags) {
            await Promise.all(
                tags.map(async tag => {
                    await Tag.create({
                        title: tag,
                        tool_id: tool.id,
                    });
                })
            );
        }
    });

    it('should not be able to insert an icon if not exists', async () => {
        const { title, link, description } = await factory.attrs('Tool');
        const tool = await request
            .post('/v1/tools')
            .send({
                icon_id: 2,
                title,
                link,
                description,
            })
            .set('Authorization', `Bearer ${token}`);

        expect(tool.status).toBe(400);
    });

    it('should be able to list all tools', async () => {
        const response = await request
            .get('/v1/tools')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it('should be able to search tools by tag', async () => {
        const response = await request
            .get('/v1/find')
            .query({ tag: 'node' })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('should be able to update a tool by id', async () => {
        const tool = await factory.attrs('Tool');
        const response = await request
            .put('/v1/tools/1')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('should not be able to update if inserted icon not exists', async () => {
        const { title, link, description, tags } = await factory.attrs('Tool');

        const response = await request
            .put('/v1/tools/1')
            .send({
                icon_id: 2,
                title,
                link,
                description,
                tags,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
    });

    it('should be able to delete a tool by id', async () => {
        const response = await request
            .delete('/v1/tools/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(204);
    });

    it('shound not be able to delete a tool if not exists', async () => {
        const response = await request
            .delete('/v1/tools/0')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
    });
});
