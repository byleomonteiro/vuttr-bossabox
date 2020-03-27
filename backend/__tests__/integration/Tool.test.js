import request from 'supertest';

import { resolve } from 'path';
import factory from '../factories';
import app from '../../src/app';
import truncate from '../util/truncate';
import auth from '../util/auth';

import RemoveFile from '../../src/app/services/RemoveFile';

let token;

describe('Tool', () => {
    beforeEach(async () => {
        await truncate();
        token = await auth();
    });

    request = request(app);

    it('should be able to register a new tool', async () => {
        const tool = await factory.attrs('Tool');
        const response = await request
            .post('/v1/tools')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(201);
    });

    it('should not be able to insert an icon if not exists', async () => {
        const { title, link, description, tags } = await factory.attrs('Tool');
        const tool = await request
            .post('/v1/tools')
            .send({
                icon_id: 2,
                title,
                link,
                description,
                tags,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(tool.status).toBe(404);
    });

    it('should be able to list all tools', async () => {
        const response = await request
            .get('/v1/tools')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it('should be able to search tools by tag', async () => {
        const tool = await factory.attrs('Tool');
        const create = await request
            .post('/v1/tools')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);
        expect(create.status).toBe(201);

        const response = await request
            .get('/v1/find')
            .query({ tag: create.body.tags[0] })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('should be able to update a tool by id', async () => {
        const tool = await factory.attrs('Tool');

        const create = await request
            .post('/v1/tools')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);
        expect(create.status).toBe(201);

        const response = await request
            .put(`/v1/tools/${create.body.id}`)
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
        expect(response.status).toBe(404);
    });

    it('should not be able to update if provided tool id not exists', async () => {
        const { title, link, description, tags } = await factory.attrs('Tool');
        const response = await request
            .put('/v1/tools/0')
            .send({
                title,
                link,
                description,
                tags,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
    });

    it('should be able to delete a tool by id', async () => {
        const tool = await factory.attrs('Tool');
        const create = await request
            .post('/v1/tools')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);
        expect(create.status).toBe(201);

        const response = await request
            .delete(`/v1/tools/${create.body.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(204);
    });

    it('should be able to delete a tool icon if exists', async () => {
        const iconPath = resolve(__dirname, 'iconsTest', 'icon.jpg');
        const icon = await request
            .post('/v1/icons')
            .attach('file', iconPath)
            .set('Authorization', `Bearer ${token}`);

        await RemoveFile(icon.body.path);

        expect(icon.status).toBe(201);

        const { title, link, description, tags } = await factory.attrs('Tool');

        const tool = await request
            .post('/v1/tools')
            .send({
                icon_id: icon.body.id,
                title,
                link,
                description,
                tags,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(tool.status).toBe(201);

        const response = await request
            .delete(`/v1/tools/${tool.body.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(204);
    });

    it('should not be able to delete if tool not exists', async () => {
        const response = await request
            .delete('/v1/tools/0')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
    });
});
