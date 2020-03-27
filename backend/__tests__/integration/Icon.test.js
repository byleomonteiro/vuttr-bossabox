import request from 'supertest';
import { resolve } from 'path';

import app from '../../src/app';
import truncate from '../util/truncate';

import auth from '../util/auth';

import RemoveFile from '../../src/app/services/RemoveFile';

let token;

describe('Icon', () => {
    beforeEach(async () => {
        await truncate();
        token = await auth();
    });

    request = request(app);

    it('should be able to upload a new icon', async () => {
        const iconPath = resolve(__dirname, 'iconsTest', 'icon.jpg');
        const response = await request
            .post('/v1/icons')
            .attach('file', iconPath)
            .set('Authorization', `Bearer ${token}`);

        await RemoveFile(response.body.path);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('path');
        expect(response.body).toHaveProperty('url');
    });

    it('should not be able to delete icon when icon not exists', async () => {
        const response = await request
            .delete('/v1/icons/0')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
    });

    it('should be able to delete an icon', async () => {
        const iconPath = resolve(__dirname, 'iconsTest', 'icon.jpg');
        const create = await request
            .post('/v1/icons')
            .attach('file', iconPath)
            .set('Authorization', `Bearer ${token}`);

        await RemoveFile(create.body.path);

        const response = await request
            .delete(`/v1/icons/${create.body.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(204);
    });
});
