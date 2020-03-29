import request from 'supertest';

import { resolve } from 'path';
import factory from '../factories';
import app from '../../src/app';
import truncate from '../util/truncate';
import auth from '../util/auth';

import RemoveFile from '../../src/app/services/RemoveFile';

let login;

describe('Tool', () => {
    beforeEach(async () => {
        await truncate();
        login = await auth();
    });

    request = request(app);

    it('should be able to register a new tool', async () => {
        const tool = await factory.attrs('Tool');
        const response = await request
            .post('/v1/tools')
            .send(tool)
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            id: response.body.id,
            title: response.body.title,
            link: response.body.link,
            description: response.body.description,
            tags: response.body.tags,
        });
    });

    it('should not be able to create tool if icon does not exists', async () => {
        const { title, link, description, tags } = await factory.attrs('Tool');
        const response = await request
            .post('/v1/tools')
            .send({
                icon_id: 2,
                title,
                link,
                description,
                tags,
            })
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            error: 'Icon not found',
        });
    });

    it('should be able to list all tools', async () => {
        const tool = await factory.attrs('Tool');
        const create = await request
            .post('/v1/tools')
            .send(tool)
            .set('Authorization', `Bearer ${login.token}`);
        expect(create.status).toBe(201);

        const create1 = await request
            .post('/v1/tools')
            .send(tool)
            .set('Authorization', `Bearer ${login.token}`);
        expect(create1.status).toBe(201);

        const response = await request
            .get('/v1/tools')
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(
            response.body.map(object => object)
        );
    });

    it('should not be able to list any data if it does not exists', async () => {
        const response = await request
            .get('/v1/tools')
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            error: 'No data was found',
        });
    });

    it('should be able to search tools by tag', async () => {
        const tool = await factory.attrs('Tool');
        const create = await request
            .post('/v1/tools')
            .send(tool)
            .set('Authorization', `Bearer ${login.token}`);
        expect(create.status).toBe(201);

        const response = await request
            .get('/v1/tools')
            .query({ tag: create.body.tags[0] })
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(
            response.body.map(object => object)
        );
    });

    it('should be able to search tools by user', async () => {
        const tool = await factory.attrs('Tool');

        const createTool = await request
            .post('/v1/tools')
            .send(tool)
            .set('Authorization', `Bearer ${login.token}`);
        expect(createTool.status).toBe(201);

        const response = await request
            .get('/v1/tools')
            .query({ user_id: login.id })
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(
            response.body.map(object => object)
        );
    });

    it('should be able to update a tool by id', async () => {
        const tool = await factory.attrs('Tool');

        const create = await request
            .post('/v1/tools')
            .send(tool)
            .set('Authorization', `Bearer ${login.token}`);
        expect(create.status).toBe(201);

        const response = await request
            .put(`/v1/tools/${create.body.id}`)
            .send(tool)
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: response.body.id,
            title: response.body.title,
            link: response.body.link,
            description: response.body.description,
            tags: response.body.tags,
        });
    });

    it('should not be able to update a tool if inserted icon does not exists', async () => {
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
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            error: 'Icon not found',
        });
    });

    it('should not be able to update if provided tool id does not exists', async () => {
        const { title, link, description, tags } = await factory.attrs('Tool');
        const response = await request
            .put('/v1/tools/0')
            .send({
                title,
                link,
                description,
                tags,
            })
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            error: 'Tool not found',
        });
    });

    it('should be able to delete a tool by id', async () => {
        const tool = await factory.attrs('Tool');
        const create = await request
            .post('/v1/tools')
            .send(tool)
            .set('Authorization', `Bearer ${login.token}`);

        expect(create.status).toBe(201);

        const response = await request
            .delete(`/v1/tools/${create.body.id}`)
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(204);
    });

    it('should be able to delete a tool icon if it does exists', async () => {
        const iconPath = resolve(__dirname, 'iconsTest', 'icon.jpg');
        const icon = await request
            .post('/v1/icons')
            .attach('file', iconPath)
            .set('Authorization', `Bearer ${login.token}`);

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
            .set('Authorization', `Bearer ${login.token}`);

        expect(tool.status).toBe(201);

        const response = await request
            .delete(`/v1/tools/${tool.body.id}`)
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(204);
    });

    it('should not be able to delete if tool does not exists', async () => {
        const response = await request
            .delete('/v1/tools/0')
            .set('Authorization', `Bearer ${login.token}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            error: 'Tool not found',
        });
    });
});
